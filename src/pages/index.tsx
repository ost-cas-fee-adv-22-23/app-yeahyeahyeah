import React, { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { fetchMumbles } from '@/services/fetchMumbles';
import { Container } from '@smartive-education/design-system-component-library-yeahyeahyeah';
import { WelcomeText, TextBoxComponent, RenderMumbles, Alert } from '@/components';
import debounce from 'lodash.debounce';
import useOnScreen from '@/hooks/useOnScreen';
import { useSession } from 'next-auth/react';

export default function Page({ quantity, fallback }: { quantity: number; fallback: any }) {
  const { data: session }: any = useSession();
  const [count, setCount] = useState(1);
  const [offset, setOffset] = useState(0);
  const [quantityTotal, setQuantityTotal] = useState(0);
  const ref = useRef(null);
  const { isOnScreen } = useOnScreen(ref);

  const { data } = useSWR({ url: '/api/mumbles', limit: quantity, offset: 0, token: session?.accessToken }, fetchMumbles, {
    refreshInterval: 2000,
  });

  useEffect(() => {
    data && data.count > 0 && setQuantityTotal(data.count);
  }, [data]);

  const handleIntersectionCallback = () => {
    setOffset((offset) => offset + quantity);
    setCount((count) => count + 1);
  };

  const handleIntersectionCallbackDebounced = debounce(async () => {
    handleIntersectionCallback();
  }, 800);

  useEffect(() => {
    if (isOnScreen && quantityTotal - quantity * 2 >= offset) handleIntersectionCallbackDebounced();
  }, [handleIntersectionCallbackDebounced, isOnScreen, quantityTotal, offset, quantity]);

  const pages: any = [];

  for (let i = 0; i < count; i++) {
    pages.push(<RenderMumbles key={i} offset={offset} limit={quantity} token={session?.accessToken} fallback={fallback} />);
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
  const quantity = 10;
  const fetch = await fetchMumbles({ limit: quantity, offset: 0 });

  console.log(fetch);

  return {
    props: {
      quantity,
      fallback: {
        '/api/mumbles': fetch,
      },
    },
  };
};
