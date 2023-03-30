import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import tw from 'twin.macro';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import debounce from 'lodash.debounce';
import useOnScreen from '@/hooks/useOnScreen';
import { GetServerSideProps } from 'next';
import { NextSeo } from 'next-seo';
import { fetchMumbles } from '@/services/fetchMumbles';
import { Button, Container } from '@smartive-education/design-system-component-library-yeahyeahyeah';
import { WelcomeText, TextBoxComponent, Alert, MumblePost, LoadingSpinner, ErrorBox } from '@/components';
import { useSession } from 'next-auth/react';
import { FetchMumbles } from '@/types/fallback';
import { alertService, Mumble } from '@/services';
import { deleteMumble } from '@/services/deleteMumble';
import { searchMumbles } from '@/services/searchMumbles';

export default function Hashtag({
  limit,
  fallback,
  hashtag,
}: {
  limit: number;
  fallback: { '/api/mumbles': FetchMumbles };
  hashtag: string;
}) {
  const { data: session }: any = useSession();
  const ref = useRef<HTMLDivElement>(null);
  const [isOnScreen, setIsOnScreen] = useOnScreen(ref);
  const resetWindowScrollPosition = useCallback(() => window.scrollTo(0, 0), []);
  let offset = useRef<number>(0);
  let quantityTotal = useRef<number>(0);

  console.log('hashtag', hashtag);

  const getKey = (pageIndex: number, previousPageData: FetchMumbles) => {
    if (previousPageData && !previousPageData.mumbles.length) {
      return null;
    }
    offset.current = pageIndex * limit;
    return { url: '/api/mumbles', limit, offset: offset.current, tags: [hashtag], token: session?.accessToken };
  };

  const { data, mutate, size, setSize, error, isValidating, isLoading } = useSWRInfinite(getKey, searchMumbles, {
    fallbackData: [fallback['/api/mumbles']],
    revalidateOnFocus: false,
    refreshInterval: 60000,
    parallel: true,
  });

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
    if (isOnScreen && !isValidating && quantityTotal.current - limit >= offset.current)
      handleIntersectionCallbackDebounced();
  }, [handleIntersectionCallbackDebounced, isOnScreen, quantityTotal, offset, limit, isValidating]);

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

  const handleRefreshPage = () => {
    mutate();
    resetWindowScrollPosition();
  };

  const setOffsetToZero = () => {
    offset.current = 0;
  };

  if (error) return <ErrorBox message={error} />;

  return (
    <>
      <NextSeo title="Mumble - Willkommen auf Mumble" description="A short description goes here." />
      <Container layout="plain">
        <WelcomeText />
        <Alert />
        <TextBoxComponent variant="write" mutate={mutate} data={data} setOffsetToZero={setOffsetToZero} />
        {data &&
          data.map((page) => {
            return page.mumbles.map((mumble: Mumble) => (
              <MumblePost
                key={mumble.id}
                id={mumble.id}
                creator={mumble.creator}
                text={mumble.text}
                mediaUrl={mumble.mediaUrl}
                createdTimestamp={mumble.createdTimestamp}
                likeCount={mumble.likeCount}
                likedByUser={mumble.likedByUser}
                replyCount={mumble.replyCount}
                type={mumble.type}
                handleDeleteCallback={handleDelete}
              />
            ));
          })}
        <div key="last" tw="invisible" ref={ref} />
        {(isLoading || isValidating) && <LoadingSpinner />}
      </Container>
    </>
  );
}
export const getServerSideProps: GetServerSideProps<any> = async ({ query: { hashtag } }) => {
  const limit = 2;

  const mumbles: FetchMumbles = await fetchMumbles({ limit: limit, offset: 0 });

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

const MumbleMessageBox = tw.div`animate-bounce fixed top-[110px] mx-auto z-50 hover:(animate-none)`;
