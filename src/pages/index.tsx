import React, { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { fetchMumbles } from '@/services/fetchMumbles';
import { Container } from '@smartive-education/design-system-component-library-yeahyeahyeah';
import { WelcomeText, TextBoxComponent, RenderMumbles, Alert } from '@/components';
import debounce from 'lodash.debounce';
import useOnScreen from '@/hooks/useOnScreen';
import { useSession } from 'next-auth/react';

const quantity = 20;

export default function Page() {
  const { data: session }: any = useSession();
  const [count, setCount] = useState(1);
  const [offset, setOffset] = useState(0);
  const [quantityTotal, setQuantityTotal] = useState(0);
  const ref = useRef(null);
  const { isOnScreen, setIsOnScreen } = useOnScreen(ref);

  const { data } = useSWR({ url: '/api/mumbles', limit: quantity, offset: 0, token: session?.accessToken }, fetchMumbles, {
    refreshInterval: 2000,
  });

  useEffect(() => {
    data && data.count > 0 && setQuantityTotal(data.count);
  }, [data]);

  const handleIntersectionCallback = () => {
    setOffset((offset) => offset + quantity);
    setCount((count) => count + 1);
    setIsOnScreen(false);
  };

  const handleIntersectionCallbackDebounced = debounce(async () => {
    handleIntersectionCallback();
  }, 800);

  useEffect(() => {
    if (isOnScreen && quantityTotal - quantity * 2 >= offset) handleIntersectionCallbackDebounced();
  }, [handleIntersectionCallbackDebounced, isOnScreen, quantityTotal, offset]);

  const pages: any = [];

  for (let i = 0; i < count; i++) {
    pages.push(<RenderMumbles key={i} offset={offset} limit={quantity} token={session?.accessToken} />);
  }

  return (
    <Container layout="plain">
      <WelcomeText />
      <Container layout="plain">
        <Alert />
      </Container>
      <TextBoxComponent variant="write" />

      {pages}

      <div key="last" tw="invisible" ref={ref} />
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps<any> = async ({ req }: GetServerSidePropsContext) => {
  const fetch = await fetchMumbles({ limit: quantity });

  console.log(fetch);

  return {
    props: {
      fallback: {
        '/api/mumbles': fetch,
      },
    },
  };
};
