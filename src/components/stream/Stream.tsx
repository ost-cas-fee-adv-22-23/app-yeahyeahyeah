import React, { useEffect, useRef } from 'react';
import { GetServerSideProps } from 'next';
import { NextSeo } from 'next-seo';
import tw from 'twin.macro';
import debounce from 'lodash.debounce';
import { useSession } from 'next-auth/react';
import useOnScreen from '@/hooks/useOnScreen';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import { FetchMumbles } from '@/types/fallback';
import { alertService, deleteMumble } from '@/services';
import { Button, Container } from '@smartive-education/design-system-component-library-yeahyeahyeah';
import { WelcomeText, TextBoxComponent, Alert, LoadingSpinner, ErrorBox, RenderMumbles } from '@/components';

type StreamProps = {
  limit: number;
  fallback: { '/api/mumbles': FetchMumbles };
  fetcher: (params: { limit: number; offset: number; newerThanMumbleId: string; token: string }) => Promise<FetchMumbles>;
  hashtag?: string;
};

export const Stream: React.FC<StreamProps> = ({ limit, fallback, hashtag, fetcher }) => {
  const { data: session }: any = useSession();
  const ref = useRef<HTMLDivElement>(null);
  const [isOnScreen, setIsOnScreen] = useOnScreen(ref);

  const getKey = (pageIndex: number, previousPageData: FetchMumbles) => {
    if (previousPageData && !previousPageData.mumbles.length) {
      return null;
    }

    return { url: '/api/mumbles', limit, offset: pageIndex * limit, token: session?.accessToken, tags: [hashtag] };
  };

  const { data, mutate, size, setSize, error, isValidating, isLoading } = useSWRInfinite(getKey, fetcher, {
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
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 10000,
    }
  );

  const handleIntersectionCallbackDebounced = debounce(async () => {
    setSize(size + 1);
    setIsOnScreen(false);
  }, 800);

  useEffect(() => {
    let quantityTotal = 0;
    if (data && data[0].count > 0) quantityTotal = data[0].count;
    if (isOnScreen && !isValidating && data && data?.length * limit <= quantityTotal) handleIntersectionCallbackDebounced();
  }, [handleIntersectionCallbackDebounced, isOnScreen, isValidating, data, limit]);

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
    window.scrollTo(0, 0);
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
};

const MumbleMessageBox = tw.div`animate-bounce fixed top-[110px] mx-auto z-50 hover:(animate-none)`;
