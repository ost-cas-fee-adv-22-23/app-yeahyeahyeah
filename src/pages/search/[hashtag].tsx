import React from 'react';
import { GetServerSideProps } from 'next';
import { getToken } from 'next-auth/jwt';
import { FetchMumbles } from '@/types/fallback';
import { searchMumbles } from '@/services';
import { Stream } from '@/components/stream/Stream';

const HashtagPage = ({
  limit,
  fallback,
  hashtag,
}: {
  limit: number;
  fallback: { '/api/mumbles': FetchMumbles };
  hashtag: string;
}) => {
  return <Stream limit={limit} fallback={fallback} fetcher={searchMumbles} hashtag={hashtag} />;
};
export const getServerSideProps: GetServerSideProps<any> = async ({ req, query: { hashtag } }: { req: any; query: any }) => {
  const limit = 2;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const mumbles: FetchMumbles = await searchMumbles({
    limit: limit,
    offset: 0,
    tags: [hashtag],
    token: token?.accessToken || '',
  });

  return {
    props: {
      limit,
      hashtag,
      fallback: {
        '/api/mumbles': mumbles,
      },
    },
  };
};

export default HashtagPage;
