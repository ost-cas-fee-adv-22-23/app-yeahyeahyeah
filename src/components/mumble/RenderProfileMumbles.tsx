import React, { useEffect, useMemo, useRef } from 'react';
import useSWR from 'swr';
import { MumblePost } from './MumblePost';
import { ErrorBox } from '../error/ErrorBox';
import { fetchMyMumbles } from '@/services';
import { LoadingSpinner } from '../loading/LoadingSpinner';
import { useSession } from 'next-auth/react';
import { FetchMumbles } from '@/types/fallback';

type RenderMumbleProps = {
  offset: number;
  limit: number;
  creator: string;
  selection: string;
  setQuantityTotal: React.Dispatch<React.SetStateAction<number>>;
  fallBackMyMumbles: { '/api/myMumbles': FetchMumbles };
};

export const RenderProfileMumbles: React.FC<RenderMumbleProps> = ({
  offset,
  limit,
  creator,
  selection,
  setQuantityTotal,
  fallBackMyMumbles,
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
      fallbackData: fallBackMyMumbles['/api/myMumbles'],
    }
  );

  useEffect(() => {
    mumbles && selection === 'mumbles' && setQuantityTotal(mumbles.count);
  }, [mumbles, setQuantityTotal, selection]);

  if (errorMumbles) return <ErrorBox message={errorMumbles} />;

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
    </>
  );
};
