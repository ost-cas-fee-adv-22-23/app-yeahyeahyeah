import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { NextSeo } from 'next-seo';
import tw from 'twin.macro';
import useSWR from 'swr';
import { GetServerSideProps } from 'next';
import { fetchMumbles } from '@/services/fetchMumbles';
import { Button, Container } from '@smartive-education/design-system-component-library-yeahyeahyeah';
import { WelcomeText, TextBoxComponent, RenderMumbles, Alert, MumblePost } from '@/components';
import debounce from 'lodash.debounce';
import useOnScreen from '@/hooks/useOnScreen';
import { useSession } from 'next-auth/react';
import { FetchMumbles } from '@/types/fallback';
import { useRouter } from 'next/router';
import useSWRInfinite from 'swr/infinite';
import { Mumble } from '@/services';

export default function Page({ limit, fallback }: { limit: number; fallback: { '/api/mumbles': FetchMumbles } }) {
  const { data: session }: any = useSession();
  const [offset, setOffset] = useState(0);
  const [quantityTotal, setQuantityTotal] = useState(0);
  const ref = useRef(null);
  const [isOnScreen] = useOnScreen(ref);
  const router = useRouter();
  const resetWindowScrollPosition = useCallback(() => window.scrollTo(0, 0), []);

  const getKey = (pageIndex: number, previousPageData: any) => {
    // console.log('previousPageData', previousPageData);
    // console.log('pageIndex', pageIndex);
    if (previousPageData && !previousPageData.mumbles.length) {
      return null;
    }
    return { url: '/api/mumbles', limit, offset: pageIndex * 2 };
  };

  const {
    data,
    mutate,
    error,
    isLoading: loading,
    size,
    setSize,
    isValidating,
  } = useSWRInfinite(getKey, fetchMumbles, {
    fallbackData: [fallback['/api/mumbles']],
    revalidateOnFocus: false,
  });

  const { data: newMumbles } = useSWR(
    {
      url: '/api/mumbles',
      newerThanMumbleId: data && data[0].mumbles[0].id,
      limit,
      offset: 0,
      token: session?.accessTokenk,
    },
    fetchMumbles,
    {
      revalidateOnFocus: false,
      refreshInterval: 5000,
    }
  );

  console.log('data', data);

  // useEffect(() => {
  //   data && data[0].mumbles[0].id && console.log('newMumbles', newMumbles);
  // }, [newMumbles, data]);

  const checkForNewMumbles = () => {
    return data && data[0].mumbles[0].id && newMumbles && newMumbles.count > 0;
  };

  const quantityNewMumbles = () => {
    return data && data[0].mumbles[0].id && newMumbles && newMumbles.count === 1
      ? 'Du hast 1 neuer Mumble'
      : `${newMumbles && newMumbles.count} Mumbles`;
  };

  const handleRefreshPage = () => {
    router.reload();
    resetWindowScrollPosition();
  };

  useEffect(() => {
    data && data[0].count > 0 && setQuantityTotal(data[0].count);
  }, []);

  const handleIntersectionCallbackDebounced = useMemo(() => {
    console.log('handleIntersectionCallbackDebounced');
    return debounce(async () => {
      //setOffset((offset) => offset + limit);
      setSize(size + 1);
    }, 800);
  }, [setSize, size]);

  useEffect(() => {
    if (isOnScreen && !isValidating && quantityTotal - limit >= offset) handleIntersectionCallbackDebounced();
  }, [handleIntersectionCallbackDebounced, isOnScreen, quantityTotal, offset, limit, isValidating]);

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
        <TextBoxComponent variant="write" mutate={mutate} data={data} setOffset={setOffset} />
        {data &&
          data.map((page, index) => {
            return page.mumbles.map((mumble: Mumble, i) => (
              <>
                <MumblePost
                  type="post"
                  key={mumble.id}
                  id={mumble.id}
                  creator={mumble.creator}
                  text={mumble.text}
                  mediaUrl={mumble.mediaUrl}
                  createdTimestamp={mumble.createdTimestamp}
                  likeCount={mumble.likeCount}
                  likedByUser={mumble.likedByUser}
                  replyCount={mumble.replyCount}
                />
              </>
            ));
          })}
        <div key="last" tw="invisible" ref={ref} />
        {/* <Button onClick={() => setSize(size + 1)} disabled={loading} color="violet" label={loading ? '...' : 'Load more'} /> */}
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

const MumbleMessageBox = tw.div`animate-bounce fixed top-[110px] mx-auto z-50 hover:(animate-none)`;
