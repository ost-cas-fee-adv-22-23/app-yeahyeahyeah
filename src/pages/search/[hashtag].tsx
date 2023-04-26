import React from 'react';
import { GetServerSideProps } from 'next';
import Message from '../../../data/content.json';
import { getToken } from 'next-auth/jwt';
import { FetchMumbles } from '@/types/fallback';
import { QwackerUserResponse, fetchUsers, searchMumbles } from '@/services';
import { Stream } from '@/components/stream/Stream';
import { NextSeo } from 'next-seo';

const HashtagPage = ({
  limit,
  fallback,
  fallbackUsers,
  hashtag,
}: {
  limit: number;
  fallback: FetchMumbles;
  fallbackUsers: QwackerUserResponse;
  hashtag: string;
}) => {
  return (
    <>
      <NextSeo title={`${Message.seo.search.title}`} description={`${Message.seo.search.description}`} />
      <Stream
        url="/api/mumbles"
        limit={limit}
        fallback={fallback}
        fallbackUsers={fallbackUsers}
        hashtag={hashtag}
        fetcher={searchMumbles}
      />
    </>
  );
};
export const getServerSideProps: GetServerSideProps<any> = async ({ req, query: { hashtag } }) => {
  const limit = 2;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const mumbles: FetchMumbles = await searchMumbles({
    limit: limit,
    offset: 0,
    tags: [hashtag] as string[],
    token: token?.accessToken || '',
  });
  const users: QwackerUserResponse =
    (token?.accessToken && (await fetchUsers({ token: token?.accessToken, offset: 0, limit: 100 }))) || [];

  return {
    props: {
      limit,
      hashtag,
      fallback: mumbles,
      fallbackUsers: users,
    },
  };
};

export default HashtagPage;
