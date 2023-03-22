import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { NextSeo } from 'next-seo';
import useSWR from 'swr';
import { GetServerSideProps } from 'next';
import { fetchMumbles } from '@/services/fetchMumbles';
import { Button, Container } from '@smartive-education/design-system-component-library-yeahyeahyeah';
import { WelcomeText, TextBoxComponent, RenderMumbles, Alert } from '@/components';
import debounce from 'lodash.debounce';
import useOnScreen from '@/hooks/useOnScreen';
import { useSession } from 'next-auth/react';
import { FetchMumbles } from '@/types/fallback';
import { useRouter } from 'next/router';

export default function Page({ limit, fallback }: { limit: number; fallback: { '/api/mumbles': FetchMumbles } }) {
  const { data: session }: any = useSession();
  const [count, setCount] = useState(1);
  const [offset, setOffset] = useState(0);
  const [quantityTotal, setQuantityTotal] = useState(0);
  const ref = useRef(null);
  const [isOnScreen] = useOnScreen(ref);
  const router = useRouter();
  const resetWindowScrollPosition = useCallback(() => window.scrollTo(0, 0), []);

  const { data, mutate } = useSWR({ url: '/api/mumbles', limit, offset: 0, token: session?.accessToken }, fetchMumbles, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
  });

  const { data: newMumbles } = useSWR(
    { url: '/api/mumbles', newerThanMumbleId: data?.mumbles[0].id, limit, offset: 0, token: session?.accessTokenk },
    fetchMumbles,
    {
      revalidateOnFocus: false,
      refreshInterval: 5000,
    }
  );

  useEffect(() => {
    data?.mumbles[0].id && console.log('newMumbles', newMumbles);
  }, [newMumbles, data]);

  const checkForNewMumbles = () => {
    return data?.mumbles[0].id && newMumbles && newMumbles.count > 0;
  };

  const handleRefreshPage = () => {
    router.reload();
    resetWindowScrollPosition();
  };

  useEffect(() => {
    data && data.count > 0 && setQuantityTotal(data.count);
  }, [data]);

  const handleIntersectionCallbackDebounced = useMemo(() => {
    return debounce(async () => {
      setOffset((offset) => offset + limit);
      setCount((count) => count + 1);
    }, 800);
  }, [limit]);

  useEffect(() => {
    if (isOnScreen && quantityTotal - limit >= offset) handleIntersectionCallbackDebounced();
  }, [handleIntersectionCallbackDebounced, isOnScreen, quantityTotal, offset, limit]);

  const pages: JSX.Element[] = [];

  for (let i = 0; i < count; i++) {
    pages.push(<RenderMumbles key={i} offset={offset} limit={limit} fallback={fallback} />);
  }

  return (
    <>
      <NextSeo title="Mumble - Willkommen auf Mumble" description="A short description goes here." />
      <Container layout="plain">
        {checkForNewMumbles() && (
          <div tw="fixed left-16 mb-16">
            <Button label="New mumbles!!!" color="slate" onClick={handleRefreshPage} />
          </div>
        )}
        <WelcomeText />
        <Container layout="plain">
          <Alert />
        </Container>
        <TextBoxComponent variant="write" mutate={mutate} data={data} setOffset={setOffset} setCount={setCount} />

        {pages}

        <div key="last" tw="invisible" ref={ref} />
      </Container>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<any> = async () => {
  const limit = 2;

  const mumbles: FetchMumbles = await fetchMumbles({ limit: limit, offset: 0 });

  console.log(mumbles);

  return {
    props: {
      limit,
      fallback: {
        '/api/mumbles': mumbles,
      },
    },
  };
};
