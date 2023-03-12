import React, { useMemo } from 'react';
import useSWR from 'swr';
import { Mumble } from '@/services/qwacker';
import { fetchMumbles } from '@/services/fetchMumbles';
import { MumblePost } from './MumblePost';
import { LoadingSpinner } from '../loading/LoadingSpinner';
import { ErrorBox } from '../error/ErrorBox';
import { useSession } from 'next-auth/react';
import { alertService } from '@/services';
import { deleteMumble } from '@/services/deleteMumble';

type RenderMumbleProps = {
  offset: number;
  limit: number;
};

export const RenderMumbles: React.FC<RenderMumbleProps> = ({ offset, limit }) => {
  const { data: session }: any = useSession();

  const _offset = useMemo(() => offset, []);
  const _limit = useMemo(() => limit, []);

  const { data, isLoading, error } = useSWR({ url: '/api/mumbles', limit: _limit, offset: _offset }, fetchMumbles);

  const handleDelete = (id: string) => {
    if (!session?.accessToken) {
      alertService.error('Bitte melde dich an, sonst kannst du nicht löschen!!', {
        autoClose: true,
        keepAfterRouteChange: false,
      });
      return;
    }
    const res = deleteMumble(id, session?.accessToken);
    console.log('res', res);
  };

  if (error) return <ErrorBox message={error} />;

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
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
      )}
    </>
  );
};
