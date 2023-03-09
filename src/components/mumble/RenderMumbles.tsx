import React, { useMemo } from 'react';
import useSWR from 'swr';
import { Mumble } from 'services/qwacker';
import { fetchMumbles } from '@/fetchMumbles';
import { MumblePost } from './MumblePost';
import { LoadingSpinner } from '../utils/LoadingSpinner';
import { ErrorBox } from '../utils/ErrorBox';

type RenderMumbleProps = {
  offset: number;
  limit: number;
};

export const RenderMumbles: React.FC<RenderMumbleProps> = ({ offset, limit }) => {
  const _offset = useMemo(() => offset, []);
  const _limit = useMemo(() => limit, []);

  const { data, isLoading, error } = useSWR({ url: '/api/mumbles', limit: _limit, offset: _offset }, fetchMumbles);

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
              />
            ))}
        </>
      )}
    </>
  );
};
