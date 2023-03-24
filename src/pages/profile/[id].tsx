import React, { useEffect, useMemo, useRef, useState } from 'react';
import useSWR from 'swr';
import { NextSeo } from 'next-seo';
import tw from 'twin.macro';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useSession } from 'next-auth/react';
import { fetchMyLikes, fetchMyMumbles, fetchUser, User } from '@/services';
import { MumbleHeader, ErrorBox } from '@/components';
import { Container, Switch } from '@smartive-education/design-system-component-library-yeahyeahyeah';
import useOnScreen from '@/hooks/useOnScreen';
import debounce from 'lodash.debounce';
import { RenderProfileMumbles } from '@/components/mumble/RenderProfileMumbles';
import { RenderLikesMumbles } from '@/components/mumble/RenderLikesMumbles';
import { getToken } from 'next-auth/jwt';
import { FetchMumbles } from '@/types/fallback';

type MumbleHeaderProps = {
  creator: any;
  limit: number;
  fallbackUser: { '/api/user': User };
  fallBackMyMumbles: { '/api/myMumbles': FetchMumbles };
};

export default function Page({ creator, limit, fallbackUser, fallBackMyMumbles }: MumbleHeaderProps) {
  const { data: session }: any = useSession();
  const [selection, setSelection] = useState('mumbles');
  const [count, setCount] = useState(1);
  const [offset, setOffset] = useState(0);
  const [quantityTotal, setQuantityTotal] = useState(0);
  const ref = useRef(null);
  const [isOnScreen] = useOnScreen(ref);

  const { data: likes } = useSWR({ url: '/api/myLikes', token: session?.accessToken }, fetchMyLikes, {
    refreshInterval: 10000,
    revalidateOnFocus: false,
    dedupingInterval: 10000,
  });

  const { data: mumbles } = useSWR(
    { url: '/api/myMumbles', creator: creator.id, token: session?.accessToken },
    fetchMyMumbles,
    {
      refreshInterval: 10000,
      revalidateOnFocus: false,
      dedupingInterval: 10000,
    }
  );

  const handleSelection = (value: string) => {
    setSelection(value);
    setOffset(0);
    setCount(1);
  };

  const handleIntersectionCallbackDebounced = useMemo(() => {
    return debounce(async () => {
      setOffset((offset) => offset + limit);
      setCount((count) => count + 1);
    }, 800);
  }, [limit]);

  useEffect(() => {
    if (isOnScreen && quantityTotal - limit >= offset) handleIntersectionCallbackDebounced();
  }, [handleIntersectionCallbackDebounced, isOnScreen, quantityTotal, offset, limit]);

  const pagesMumbles: JSX.Element[] = [];
  const pagesLikes: JSX.Element[] = [];

  for (let i = 0; i < count; i++) {
    selection === 'mumbles' &&
      pagesMumbles.push(
        <RenderProfileMumbles
          key={i}
          offset={offset}
          limit={limit}
          creator={creator.id}
          selection={selection}
          setQuantityTotal={setQuantityTotal}
          fallBackMyMumbles={fallBackMyMumbles}
        />
      );
    selection === 'likes' &&
      pagesLikes.push(
        <RenderLikesMumbles
          key={i}
          offset={offset}
          limit={limit}
          creator={creator.id}
          selection={selection}
          setQuantityTotal={setQuantityTotal}
        />
      );
  }

  return (
    <>
      <NextSeo
        title={`${session && session.user.firstname} ${session && session.user.lastname}'s mumble profile`}
        description={`Profile of ${session && session.user.username}`}
        canonical="https://mumble-yeahyeahyeah.ch"
      />

      <Container layout="plain">
        <MumbleHeader creator={creator} fallbackUser={fallbackUser} />

        {session?.user.id === creator.id ? (
          <>
            <Switch
              fCallBack={(value) => handleSelection(value)}
              options={[
                {
                  label: 'Deine Mumbles',
                  value: 'mumbles',
                },
                {
                  label: 'Deine Likes',
                  value: 'likes',
                },
              ]}
              value="mumbles"
            />

            <SelectionWrapper>
              {selection === 'mumbles' && pagesMumbles}
              {selection === 'likes' && pagesLikes}

              {selection === 'mumbles' && mumbles?.count === 0 && (
                <ErrorBox message="Die Liste ist leer. Schreib deinen ersten Mumble." />
              )}
              {selection === 'likes' && likes?.mumbles.length === 0 && (
                <ErrorBox message="Du hast noch kein Mumble abgeliked!" />
              )}

              {/* Start profile page STRANGER */}
              <div tw="bg-violet-500 p-8 mb-16 rounded-md flex justify-center">
                <p tw="text-slate-white font-medium">TBD - Profile Page NEW USER - Lists recommended mumbles</p>
              </div>
              {/* End profile  */}
            </SelectionWrapper>
          </>
        ) : (
          <SelectionWrapper>{selection === 'mumbles' && pagesMumbles}</SelectionWrapper>
        )}
        <div key="last" tw="invisible" ref={ref} />
      </Container>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<any> = async ({ req, query: { id } }: GetServerSidePropsContext) => {
  const limit = 10;
  const _id = id as string;

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const user: User | string = token?.accessToken ? await fetchUser({ id: _id, token: token?.accessToken }) : '';
  const myMumbles: FetchMumbles = await fetchMyMumbles({ creator: _id, token: token?.accessToken });

  return {
    props: {
      creator: id && { id: _id },
      limit,
      fallbackUser: {
        '/api/user': user || {
          userName: 'username',
          firstName: 'Unknown',
          lastName: 'User',
          avatarUrl: '',
        },
      },
      fallBackMyMumbles: {
        '/api/myMumbles': myMumbles,
      },
    },
  };
};

const SelectionWrapper = tw.div`mt-16 mb-16`;
