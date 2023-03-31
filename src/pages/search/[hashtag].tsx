import React, { useEffect, useMemo, useRef, useState } from 'react';
import useSWRInfinite from 'swr/infinite';
import debounce from 'lodash.debounce';
import useOnScreen from '@/hooks/useOnScreen';
import { GetServerSideProps } from 'next';
import { NextSeo } from 'next-seo';
import { Container } from '@smartive-education/design-system-component-library-yeahyeahyeah';
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
  let offset = useRef<number>(0);
  let quantityTotal = useRef<number>(0);
  let finished = useRef<boolean>(false);

  const getKey = (pageIndex: number, previousPageData: FetchMumbles) => {
    if (previousPageData && !previousPageData.mumbles.length) {
      finished.current = true;
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
    if (isOnScreen && !isValidating && !finished.current) handleIntersectionCallbackDebounced();
  }, [handleIntersectionCallbackDebounced, isOnScreen, isValidating]);

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

  if (error) return <ErrorBox message={error} />;

  return (
    <>
      <NextSeo title="Mumble - Willkommen auf Mumble" description="A short description goes here." />
      <Container layout="plain">
        <WelcomeText />

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
export const getServerSideProps: GetServerSideProps<any> = async ({ query: { hashtag } }: { query: any }) => {
  const limit = 2;

  const mumbles: FetchMumbles = await searchMumbles({ limit: limit, offset: 0, tags: [hashtag] });

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
