import React from 'react';
import { GetServerSideProps } from 'next';
import { FetchMumbles } from '@/types/fallback';
import { fetchMumbles } from '@/services';
import { Stream } from '@/components/stream/Stream';
import { NextSeo } from 'next-seo';
import Content from '../../data/content.json';
import { getToken } from 'next-auth/jwt';

export default function Page({ limit, fallback }: { limit: number; fallback: { '/api/mumbles': FetchMumbles } }) {
  console.log(Content.seo.home.title);

  return (
    <>
      <NextSeo title={`${Content.seo.home.title}`} description={`${Content.seo.home.description}`} />
      <Stream url="/api/mumbles" limit={limit} fallback={fallback} fetcher={fetchMumbles} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps<any> = async ({ req }) => {
  const limit = 2;
  const token = await getToken({ req });
  const mumbles: FetchMumbles = await fetchMumbles({ limit: limit, offset: 0, token: token?.accessToken || '' });

  return {
    props: {
      limit,
      fallback: mumbles,
    },
  };
};
