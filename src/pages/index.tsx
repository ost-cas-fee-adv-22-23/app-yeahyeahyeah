import React, { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import { GetServerSideProps } from 'next';
import { fetchMumbles } from '@/services/fetchMumbles';
import { Container } from '@smartive-education/design-system-component-library-yeahyeahyeah';
import { WelcomeText, TextBoxComponent, RenderMumbles, Alert } from '@/components';
import debounce from 'lodash.debounce';
import useOnScreen from '@/hooks/useOnScreen';
import { useSession } from 'next-auth/react';
import { FetchMumbles } from '@/types/fallback';

export default function Page({ quantity, fallback }: { quantity: number; fallback: { '/api/mumbles': FetchMumbles } }) {
  const { data: session }: any = useSession();
  const [count, setCount] = useState(1);
  const [offset, setOffset] = useState(0);
  const [quantityTotal, setQuantityTotal] = useState(0);
  const ref = useRef(null);
  const [isOnScreen] = useOnScreen(ref);

  const { data, mutate } = useSWR(
    { url: '/api/mumbles', limit: quantity, offset: 0, token: session?.accessToken },
    fetchMumbles,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
    }
  );

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
    if (isOnScreen && quantityTotal - quantity >= offset) handleIntersectionCallbackDebounced();
  }, [handleIntersectionCallbackDebounced, isOnScreen, quantityTotal, offset, quantity]);

  const pages: JSX.Element[] = [];

  for (let i = 0; i < count; i++) {
    pages.push(<RenderMumbles key={i} offset={offset} limit={quantity} fallback={fallback} />);
  }

  return (
    <Container layout="plain">
      <WelcomeText />
      <Container layout="plain">
        <Alert />
      </Container>
      {/* <TextBoxComponent variant="write" mutate={mutate} data={data} /> */}

      {pages}

      <div key="last" tw="invisible" ref={ref} />
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps<any> = async () => {
  const quantity = 20;

  const mumbles: FetchMumbles = await fetchMumbles({ limit: quantity, offset: 0 });

  console.log(mumbles);

  return {
    props: {
      quantity,
      fallback: {
        '/api/mumbles': mumbles,
      },
    },
  };
};
