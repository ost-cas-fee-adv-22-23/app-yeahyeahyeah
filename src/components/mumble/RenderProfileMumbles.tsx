import React, { useEffect, useMemo, useRef } from 'react';
import useSWR from 'swr';
import { MumblePost } from './MumblePost';
import { ErrorBox } from '../error/ErrorBox';
import { fetchMyLikes, fetchMyMumbles } from '@/services';
import { LoadingSpinner } from '../loading/LoadingSpinner';
import { useSession } from 'next-auth/react';

type RenderMumbleProps = {
  offset: number;
  limit: number;
  creator: string;
  selection: string;
  setQuantityTotal: React.Dispatch<React.SetStateAction<number>>;
};

export const RenderProfileMumbles: React.FC<RenderMumbleProps> = ({
  offset,
  limit,
  creator,
  selection,
  setQuantityTotal,
}) => {
  const { data: session }: any = useSession();
  const _offset = useMemo(() => offset, []);
  const _limit = useMemo(() => limit, []);

  const {
    data: mumbles,
    isLoading: loadingMumbles,
    error: errorMumbles,
  } = useSWR(
    { url: '/api/myMumbles', limit: _limit, offset: _offset, creator, token: session?.accessToken },
    fetchMyMumbles,
    {
      refreshInterval: 10000,
      revalidateOnFocus: false,
    }
  );

  const {
    data: likes,
    isLoading: loadingLikes,
    error: errorLikes,
  } = useSWR({ url: '/api/myLikes', limit: _limit, offset: _offset, creator, token: session?.accessToken }, fetchMyLikes, {
    refreshInterval: 10000,
    revalidateOnFocus: false,
  });

  useEffect(() => {
    mumbles && selection === 'mumbles' && setQuantityTotal(mumbles.count);
    likes && selection === 'likes' && setQuantityTotal(likes.count);
  }, [mumbles, likes, setQuantityTotal, selection]);

  if (errorMumbles) return <ErrorBox message={errorMumbles} />;

  if (errorLikes) return <ErrorBox message={errorLikes} />;

  return (
    <>
      {loadingMumbles && <LoadingSpinner />}
      {selection === 'mumbles' && (
        <>
          {mumbles?.mumbles.map((data: any, idx: number) => (
            <MumblePost
              key={idx}
              id={data.id}
              creator={data.creator}
              text={data.text || ''}
              mediaUrl={data.mediaUrl || ''}
              likeCount={data.likeCount || 0}
              createdTimestamp={data.createdTimestamp}
              likedByUser={data.likedByUser || false}
              replyCount={data.replyCount || 0}
              type="post"
            />
          ))}
        </>
      )}
      {loadingLikes && <LoadingSpinner />}
      {selection === 'likes' && (
        <>
          {likes?.mumbles.map((data: any, idx: number) => (
            <MumblePost
              key={idx}
              id={data.id}
              creator={data.creator}
              text={data.text || ''}
              mediaUrl={data.mediaUrl || ''}
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
