import React, { useEffect, useMemo, useRef } from 'react';
import useSWR from 'swr';
import { Mumble } from '@/services/qwacker';
import { fetchMumbles } from '@/services/fetchMumbles';
import { MumblePost } from './MumblePost';
import { ErrorBox } from '../error/ErrorBox';
import { alertService } from '@/services';
import { deleteMumble } from '@/services/deleteMumble';
import { LoadingSpinner } from '../loading/LoadingSpinner';
import { useSession } from 'next-auth/react';
import { FetchMumbles } from '@/types/fallback';

type RenderMumbleProps = {
  offset: number;
  limit: number;
  fallback: { '/api/mumbles': FetchMumbles };
};

export const RenderMumbles: React.FC<RenderMumbleProps> = ({ offset, limit, fallback }) => {
  const { data: session }: any = useSession();
  const _offset = useMemo(() => offset, []);
  const _limit = useMemo(() => limit, []);

  const hasMounted = useRef(false);

  useEffect(() => {
    hasMounted.current = true;
  }, []);

  const { data, error, isLoading, mutate } = useSWR(
    { url: '/api/mumbles', limit: _limit, offset: _offset, token: session?.accessToken },
    fetchMumbles,
    {
      fallbackData: fallback['/api/mumbles'],
      refreshInterval: 10000,
    }
  );

  const handleDelete = async (id: string) => {
    if (!session?.accessToken) {
      alertService.error('Bitte melde dich an, sonst kannst du nicht löschen!!', {
        autoClose: true,
        keepAfterRouteChange: false,
      });
      return;
    }
    const res = await deleteMumble(id, session?.accessToken);

    // TODO: Is this a magic number ?
    if (res.status === 204) {
      const newData = data?.mumbles.filter((mumble: Mumble) => mumble.id !== id);
      if (data) {
        data.mumbles = newData as Mumble[];
        mutate({ ...data });
      }
    }
  };

  if (error) return <ErrorBox message={error} />;

  return (
    <>
      {isLoading && <LoadingSpinner />}
      {data &&
        data.mumbles.map((mumble: Mumble) => (
          <MumblePost
            key={mumble.id}
            id={mumble.id}
            creator={mumble.creator}
            text={mumble.text}
            mediaUrl={mumble.mediaUrl}
            createdTimestamp={mumble.createdTimestamp}
            likeCount={mumble.likeCount}
            likedByUser={mumble.likedByUser}
            replyCount={mumble.replyCount}
            type={mumble.type}
            handleDeleteCallback={handleDelete}
          />
        ))}
    </>
  );
};
