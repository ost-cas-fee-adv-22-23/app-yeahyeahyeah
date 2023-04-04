import React, { useEffect, useMemo } from 'react';
import useSWR from 'swr';
import { MumblePost } from './MumblePost';
import { ErrorBox } from '../error/ErrorBox';
import { fetchMyLikes, Mumble } from '@/services';
import { LoadingSpinner } from '../loading/LoadingSpinner';
import { useSession } from 'next-auth/react';

type RenderMumbleProps = {
  offset: number;
  limit: number;
  creator: string;
  selection: string;
  setQuantityTotal: React.Dispatch<React.SetStateAction<number>>;
};

export const RenderLikesMumbles = ({ offset, limit, creator, selection, setQuantityTotal }: RenderMumbleProps) => {
  const { data: session }: any = useSession();
  const _offset = useMemo(() => offset, []);
  const _limit = useMemo(() => limit, []);

  const {
    data: likes,
    isLoading: loadingLikes,
    error: errorLikes,
  } = useSWR({ url: '/api/myLikes', limit: _limit, offset: _offset, creator, token: session?.accessToken }, fetchMyLikes, {
    refreshInterval: 10000,
    revalidateOnFocus: false,
  });

  useEffect(() => {
    likes && selection === 'likes' && setQuantityTotal(likes.count);
  }, [likes, setQuantityTotal, selection]);

  if (errorLikes) return <ErrorBox message={errorLikes} />;

  return (
    <>
      {loadingLikes && <LoadingSpinner />}
      {selection === 'likes' && (
        <>
          {likes?.mumbles.map((data: Mumble, idx: number) => (
            <MumblePost
              key={idx}
              id={data.id}
              creator={data.creator}
              text={data.text || ''}
              mediaUrl={data.mediaUrl || ''}
              mediaType={data.mediaType}
              likeCount={data.likeCount || 0}
              createdTimestamp={data.createdTimestamp}
              likedByUser={data.likedByUser || false}
              replyCount={data.replyCount || 0}
              type="post"
            />
          ))}
        </>
      )}
    </>
  );
};
