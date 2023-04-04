import React, { useEffect, useMemo, useRef } from 'react';
import { GetServerSideProps } from 'next';
import { NextSeo } from 'next-seo';
import { getToken } from 'next-auth/jwt';
import useSWRInfinite from 'swr/infinite';
import useSWR from 'swr';
import debounce from 'lodash.debounce';
import useOnScreen from '@/hooks/useOnScreen';
import { useSession } from 'next-auth/react';
import { FetchMumbles } from '@/types/fallback';
import { alertService, Mumble, deleteMumble, searchMumbles } from '@/services';
import {
  Container,
  Heading,
  Hashtag as HashtagComponent,
} from '@smartive-education/design-system-component-library-yeahyeahyeah';
import { LoadingSpinner, ErrorBox, RenderMumbles } from '@/components';
import Link from 'next/link';

const HashtagPage = ({
  limit,
  fallback,
  hashtag,
}: {
  limit: number;
  fallback: { '/api/mumbles': FetchMumbles };
  hashtag: string;
}) => {
  const { data: session }: any = useSession();
  const ref = useRef<HTMLDivElement>(null);
  const [isOnScreen, setIsOnScreen] = useOnScreen(ref);
  let offset = useRef<number>(0);
  let quantityTotal = useRef<number>(0);

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

  const { data: hashtagData } = useSWR(
    { url: '/api/mumbles', limit: 10, offset: 0, text: '#', token: session?.accessToken },
    searchMumbles,
    {
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

  const renderHashtags = (text: string) => {
    return text.split(' ').map((str, i) => {
      if (str.startsWith('#')) {
        return (
          <React.Fragment key={i}>
            <HashtagComponent
              label={str.replace('#', '')}
              size="xlarge"
              color={str.replace('#', '') === hashtag ? 'violet' : 'slate-300'}
              linkComponent={Link}
              href={`/search/${str.replace('#', '')}`}
              legacyBehavior
              passHref
            />{' '}
          </React.Fragment>
        );
      }
      return ' ';
    });
  };

  if (error) return <ErrorBox message={error} />;

  return (
    <>
      <NextSeo title="Mumble - Willkommen auf Mumble" description="A short description goes here." />
      <Container layout="plain">
        <div tw="mb-16 mx-16">
          <Heading label="Latest Hashtags..." color="violet" tag="h1" size="default" mbSpacing="8" />
          <Heading label="...used by other users" color="light" tag="h2" size="xlarge" mbSpacing="32" />
        </div>
        <div tw="flex flex-wrap bg-slate-white transform duration-500 bg-slate-100 rounded-xl p-16 sm:p-32 mb-32 gap-8 min-h-[280px]">
          {hashtagData && hashtagData.mumbles.map((mumble: Mumble) => renderHashtags(mumble.text))}
        </div>

        {data && RenderMumbles(data, session, handleDelete)}
        <div key="last" tw="invisible" ref={ref} />
        <div tw="h-16 mb-32">{(isLoading || isValidating) && <LoadingSpinner />}</div>
      </Container>
    </>
  );
};
export const getServerSideProps: GetServerSideProps<any> = async ({ req, query: { hashtag } }: { req: any; query: any }) => {
  const limit = 2;

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const mumbles: FetchMumbles = await searchMumbles({
    limit: limit,
    offset: 0,
    tags: [hashtag],
    token: token?.accessToken || '',
  });

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

export default HashtagPage;
