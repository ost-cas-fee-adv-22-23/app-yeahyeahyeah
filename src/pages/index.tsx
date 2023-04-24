import React from 'react';
import { GetServerSideProps } from 'next';
import { FetchMumbles } from '@/types/fallback';
import { QwackerUserResponse, User, fetchMumbles, fetchUsers } from '@/services';
import { Stream } from '@/components';
import { NextSeo } from 'next-seo';
import Content from '../../data/content.json';
import { getToken } from 'next-auth/jwt';
import { getSession } from 'next-auth/react';

export default function Page({
  limit,
  fallback,
  fallbackUsers,
  fallbackUserLoggedIn,
}: {
  limit: number;
  fallback: FetchMumbles;
  fallbackUsers: QwackerUserResponse;
  fallbackUserLoggedIn: User;
}) {
  return (
    <>
      <NextSeo title={`${Content.seo.home.title}`} description={`${Content.seo.home.description}`} />
      <Stream
        url="/api/mumbles"
        limit={limit}
        fallback={fallback}
        fetcher={fetchMumbles}
        fallbackUsers={fallbackUsers}
        fallbackUserLoggedIn={fallbackUserLoggedIn}
      />
    </>
  );
}

export const getServerSideProps: GetServerSideProps<any> = async ({ req }) => {
  const limit = 2;
  const token = await getToken({ req });
  const mumbles: FetchMumbles = await fetchMumbles({ limit: limit, offset: 0, token: token?.accessToken || '' });
  const users: QwackerUserResponse =
    (token?.accessToken && (await fetchUsers({ token: token?.accessToken, offset: 0, limit: 100 }))) || [];

  const session: any = await getSession({ req });
  const fallbackUserLoggedIn = users.data.find((x) => x.id === session.user.id);

  return {
    props: {
      limit,
      fallback: mumbles,
      fallbackUsers: users,
      fallbackUserLoggedIn,
    },
  };
};
