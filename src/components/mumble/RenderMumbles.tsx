import React, { useMemo } from 'react';
import useSWR from 'swr';
import { Mumble } from 'services/qwacker';
import { fetchMumbles } from '../../../services/fetchMumbles';
import { MumblePost } from './MumblePost';

type RenderMumbleProps = {
  offset: number;
};

export const RenderMumbles: React.FC<RenderMumbleProps> = ({ offset }) => {
  const off = useMemo(() => offset, []);

  const {
    data,
    error,
    isLoading: loading,
  } = useSWR({ url: '/api/mumbles', limit: 2, offset: off }, fetchMumbles, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  if (loading) return <>Loading...</>;

  if (error) return <>Failed to load</>;

  return (
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
  );
};
