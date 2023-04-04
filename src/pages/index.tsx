import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { GetServerSideProps } from 'next';
import { NextSeo } from 'next-seo';
import tw from 'twin.macro';
import debounce from 'lodash.debounce';
import { useSession } from 'next-auth/react';
import useOnScreen from '@/hooks/useOnScreen';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import { FetchMumbles } from '@/types/fallback';
import { fetchMumbles, alertService, deleteMumble } from '@/services';
import { Button, Container } from '@smartive-education/design-system-component-library-yeahyeahyeah';
import { WelcomeText, TextBoxComponent, Alert, LoadingSpinner, ErrorBox, RenderMumbles } from '@/components';

export default function Page({ limit, fallback }: { limit: number; fallback: { '/api/mumbles': FetchMumbles } }) {
  const { data: session }: any = useSession();
  const ref = useRef<HTMLDivElement>(null);
  const [isOnScreen, setIsOnScreen] = useOnScreen(ref);
  const resetWindowScrollPosition = useCallback(() => window.scrollTo(0, 0), []);
  let offset = useRef<number>(0);
  let quantityTotal = useRef<number>(0);

  const getKey = (pageIndex: number, previousPageData: FetchMumbles) => {
    if (previousPageData && !previousPageData.mumbles.length) {
      return null;
    }
    offset.current = pageIndex * limit;
    return { url: '/api/mumbles', limit, offset: offset.current, token: session?.accessToken };
  };

  const { data, mutate, size, setSize, error, isValidating, isLoading } = useSWRInfinite(getKey, fetchMumbles, {
    fallbackData: [fallback['/api/mumbles']],
    revalidateOnFocus: false,
    refreshInterval: 60000,
    parallel: true,
  });

  console.log('data', data);

  const { data: newMumbles } = useSWR(
    {
      url: '/api/mumbles',
      newerThanMumbleId: data && data[0]?.mumbles[0].id,
      limit,
      offset: 0,
      token: session?.accessToken,
    },
    fetchMumbles,
    {
      revalidateOnFocus: false,
      refreshInterval: 10000,
    }
  );

  useEffect(() => {
    if (data && data[0].count > 0) quantityTotal.current = data[0].count;
  }, [data]);

  const handleIntersectionCallbackDebounced = useMemo(() => {
    return debounce(async () => {
      setSize(size + 1);
      setIsOnScreen(false);
    }, 800);
  }, [setSize, size, setIsOnScreen]);

  useEffect(() => {
    if (isOnScreen && !isValidating && data && data?.length * limit <= quantityTotal.current)
      handleIntersectionCallbackDebounced();
  }, [handleIntersectionCallbackDebounced, isOnScreen, isValidating, data, limit, quantityTotal]);

  const checkForNewMumbles = () => {
    return data && data[0]?.mumbles[0].id && newMumbles && newMumbles.count > 0;
  };

  const handleDelete = async (id: string) => {
    if (!session?.accessToken) {
      alertService.error('Bitte melde dich an, sonst kannst du nicht löschen!!', {
        autoClose: true,
        keepAfterRouteChange: false,
      });
      return;
    }
    const res = await deleteMumble(id, session?.accessToken);

    //TODO: Is this a magic number ?
    if (res.status === 204) {
      mutate();
    }
  };

  const quantityNewMumbles = () => {
    return data && data[0]?.mumbles[0].id && newMumbles && newMumbles.count === 1
      ? '1 neuer Mumble'
      : `${newMumbles && newMumbles.count} neue Mumbles`;
  };

  const handleRefreshPage = () => {
    mutate();
    resetWindowScrollPosition();
  };

  if (error) return <ErrorBox message={error} />;

  return (
    <>
      <NextSeo title="Mumble - Willkommen auf Mumble" description="A short description goes here." />
      {checkForNewMumbles() && (
        <MumbleMessageBox>
          <Button label={`${quantityNewMumbles()}`} color="gradient" onClick={handleRefreshPage} size="small" width="full" />
        </MumbleMessageBox>
      )}
      <Container layout="plain">
        <WelcomeText />
        <Alert />
        <TextBoxComponent variant="write" mutate={mutate} data={data} />
        {data && RenderMumbles(data, session, handleDelete)}
        <div key="last" tw="invisible" ref={ref} />
        <div tw="h-16 mb-32">{(isLoading || isValidating) && <LoadingSpinner />}</div>
      </Container>
    </>
  );
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

const MumbleMessageBox = tw.div`animate-bounce fixed top-[110px] mx-auto z-50 hover:(animate-none)`;
