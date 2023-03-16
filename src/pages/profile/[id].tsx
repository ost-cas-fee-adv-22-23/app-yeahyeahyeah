import React, { useEffect, useRef, useState } from 'react';
import tw from 'twin.macro';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useSession } from 'next-auth/react';
import { fetchMyMumbles, fetchUser, User } from '@/services';
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
  quantity: number;
  fallbackUser: { '/api/user': User };
  fallBackMyMumbles: { '/api/myMumbles': FetchMumbles };
};

export default function Page({ creator, quantity, fallbackUser, fallBackMyMumbles }: MumbleHeaderProps) {
  const { data: session }: any = useSession();
  const [selection, setSelection] = useState('mumbles');
  const [count, setCount] = useState(1);
  const [offset, setOffset] = useState(0);
  const [quantityTotal, setQuantityTotal] = useState(0);
  const ref = useRef(null);
  const [isOnScreen] = useOnScreen(ref);

  const handleSelection = (value: string) => {
    setSelection(value);
    setOffset(0);
    setCount(1);
  };

  const handleIntersectionCallback = () => {
    setOffset((offset) => offset + quantity);
    setCount((count) => count + 1);
  };

  const handleIntersectionCallbackDebounced = debounce(async () => {
    handleIntersectionCallback();
  }, 800);

  useEffect(() => {
    if (isOnScreen && quantityTotal - quantity >= offset) handleIntersectionCallbackDebounced();
  }, [handleIntersectionCallbackDebounced, isOnScreen, quantityTotal, offset, quantity]);

  const pagesMumbles: JSX.Element[] = [];
  const pagesLikes: JSX.Element[] = [];

  for (let i = 0; i < count; i++) {
    selection === 'mumbles' &&
      pagesMumbles.push(
        <RenderProfileMumbles
          key={i}
          offset={offset}
          limit={quantity}
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
          limit={quantity}
          creator={creator.id}
          selection={selection}
          setQuantityTotal={setQuantityTotal}
        />
      );
  }

  return (
    <Container layout="plain">
      <MumbleHeader creator={creator} fallbackUser={fallbackUser} />

      {session?.accessToken ? (
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

            {selection === 'mumbles' && quantityTotal === 0 && (
              <ErrorBox message="Die Liste ist leer. Schreib deinen ersten Mumble." />
            )}
            {selection === 'likes' && quantityTotal === 0 && <ErrorBox message="Du hast noch kein Mumble abgeliked!" />}
            {/* End user profile page */}
            {/* Start profile page STRANGER */}
            <div tw="bg-pink-500 p-8 mb-16 rounded-md flex justify-center">
              <p tw="text-slate-white font-medium">TBD - Profile Page STRANGER - Lists only users mumbles</p>
            </div>
            {/* End profile  */}
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
  );
}

export const getServerSideProps: GetServerSideProps<any> = async ({ req, query: { id } }: GetServerSidePropsContext) => {
  const quantity = 10;
  const _id = id as string;

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const user: User | string = token?.accessToken ? await fetchUser({ id: _id, token: token?.accessToken }) : '';
  const myMumbles: FetchMumbles = await fetchMyMumbles({ creator: _id, token: token?.accessToken });

  return {
    props: {
      creator: id && { id: _id },
      quantity,
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
