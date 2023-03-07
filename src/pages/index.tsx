import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { fetchMumbles } from '../../services/fetchMumbles';
import { Button, Container } from '@smartive-education/design-system-component-library-yeahyeahyeah';
import { WelcomeText, TextBoxComponent, RenderMumbles } from '@/components';

const quantity = 10;

export default function Page() {
  const [count, setCount] = useState(1);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);

  const pages: any = [];

  for (let i = 0; i < count; i++) {
    pages.push(<RenderMumbles key={i} offset={offset} limit={quantity} />);
  }

  return (
    <Container layout="plain">
      <WelcomeText />
      <TextBoxComponent variant="write" />

      {pages}

      <Button
        onClick={() => {
          setOffset(offset + quantity);
          setCount(count + 1);
        }}
        color="violet"
        label={loading ? '...' : 'Load more'}
      />
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
