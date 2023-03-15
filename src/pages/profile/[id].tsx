import React, { useEffect, useRef, useState } from 'react';
import tw from 'twin.macro';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { fetchUser, fetchMyMumbles, fetchMyLikes } from '@/services';
import { LoadingSpinner, MumbleHeader, MumblePost, ErrorBox } from '@/components';
import { Container, Switch } from '@smartive-education/design-system-component-library-yeahyeahyeah';
import useOnScreen from '@/hooks/useOnScreen';
import debounce from 'lodash.debounce';
import { RenderProfileMumbles } from '@/components/mumble/RenderProfileMumbles';

type MumbleHeaderProps = {
  creator: any;
  quantity: number;
  fallback: any;
  fallbackReplies: any;
};

const swrConfig = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

export default function Page({ creator, quantity }: MumbleHeaderProps) {
  const { data: session }: any = useSession();
  const [selection, setSelection] = useState('mumbles');
  const _id = creator?.id;
  const [count, setCount] = useState(1);
  const [offset, setOffset] = useState(0);
  const [quantityTotal, setQuantityTotal] = useState(0);
  const ref = useRef(null);
  const [isOnScreen] = useOnScreen(ref);

  useEffect(() => {}, [quantityTotal]);

  const handleSelection = (value: string) => {
    setSelection(value);
  };

  const { data: user, isLoading } = useSWR({ url: '/api/user', id: _id, token: session?.accessToken }, fetchUser, {
    ...swrConfig,
  });

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

  const pages: JSX.Element[] = [];

  for (let i = 0; i < count; i++) {
    pages.push(
      <RenderProfileMumbles
        key={i}
        offset={offset}
        limit={quantity}
        creator={creator?.id}
        selection={selection}
        setQuantityTotal={setQuantityTotal}
      />
    );
  }

  return (
    <Container layout="plain">
      {isLoading && <LoadingSpinner />}

      {user && <MumbleHeader user={user} />}

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
        {pages}

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
        <div key="last" tw="invisible" ref={ref} />
      </SelectionWrapper>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps<any> = async ({ query: id }: GetServerSidePropsContext) => {
  const quantity = 2;

  const fetch = await fetchMyMumbles({ limit: quantity, offset: 0, creator: id });

  console.log(fetch);

  return {
    props: {
      creator: id,
      quantity,
    },
  };
};

const SelectionWrapper = tw.div`mt-16 mb-16`;
