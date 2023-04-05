import React from 'react';
import { GetServerSideProps } from 'next';
import { FetchMumbles } from '@/types/fallback';
import { fetchMumbles } from '@/services';
import { Stream } from '@/components/stream/Stream';

export default function Page({ limit, fallback }: { limit: number; fallback: { '/api/mumbles': FetchMumbles } }) {
  return <Stream limit={limit} fallback={fallback} fetcher={fetchMumbles} />;
}

export const getServerSideProps: GetServerSideProps<any> = async () => {
  const limit = 2;

  const mumbles: FetchMumbles = await fetchMumbles({ limit: limit, offset: 0 });

  return {
    props: {
      limit,
      fallback: {
        '/api/mumbles': mumbles,
      },
    },
  };
};
