import React, { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { fetchMumbles } from '../../services/fetchMumbles';
import { Container } from '@smartive-education/design-system-component-library-yeahyeahyeah';
import { WelcomeText, TextBoxComponent, RenderMumbles } from '@/components';
import debounce from 'lodash.debounce';
import useOnScreen from 'hooks/useOnScreen';

const quantity = 5;

export default function Page() {
  const [count, setCount] = useState(1);
  const [offset, setOffset] = useState(0);
  const [quantityItemsTotal, setQuantityItemsTotal] = useState(0);
  const ref = useRef(null);
  const isOnScreen = useOnScreen(ref);
  const quantitiyItems = (quantity: number) => setQuantityItemsTotal(quantity);

  const handleIntersectionCallback = () => {
    setOffset((offset) => offset + quantity);
    setCount((count) => count + 1);
  };

  const handleIntersectionCallbackDebounced = debounce(async () => {
    handleIntersectionCallback();
  }, 1000);

  useEffect(() => {
    if (isOnScreen && quantityItemsTotal >= offset) handleIntersectionCallbackDebounced();
  }, [handleIntersectionCallbackDebounced, isOnScreen, quantityItemsTotal, offset]);

  const pages: any = [];

  for (let i = 0; i < count; i++) {
    i === 0
      ? pages.push(<RenderMumbles key={i} offset={offset} limit={quantity} />)
      : pages.push(<RenderMumbles key={i} offset={offset} limit={quantity} quantitiyItems={quantitiyItems} />);
  }

  return (
    <Container layout="plain">
      <WelcomeText />
      <TextBoxComponent variant="write" />

      {pages}

      <div tw="invisible" ref={ref} />
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
