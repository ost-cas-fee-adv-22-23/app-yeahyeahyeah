import React from 'react';
import { GetServerSideProps } from 'next';
import Message from '../../../data/content.json';
import { getToken } from 'next-auth/jwt';
import { FetchMumbles } from '@/types/fallback';
import { searchMumbles } from '@/services';
import { Stream } from '@/components/stream/Stream';
import { NextSeo } from 'next-seo';
import { IncomingMessage } from 'http';

const HashtagPage = ({ limit, fallback, hashtag }: { limit: number; fallback: FetchMumbles; hashtag: string }) => {
  return (
    <>
      <NextSeo title={`${Message.seo.search.title}`} description={`${Message.seo.search.description}`} />
      <Stream url="/api/mumbles" limit={limit} fallback={fallback} hashtag={hashtag} fetcher={searchMumbles} />
    </>
  );
};
export const getServerSideProps: GetServerSideProps<any> = async ({
  req,
  query: { hashtag },
}: {
  req: IncomingMessage & {
    cookies: Partial<{
      [key: string]: string;
    }>;
  };
  query: any;
}) => {
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
      fallback: mumbles,
    },
  };
};

export default HashtagPage;
