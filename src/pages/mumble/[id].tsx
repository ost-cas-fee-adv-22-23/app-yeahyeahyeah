import React from 'react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { NextSeo } from 'next-seo';
import useSWR from 'swr';
import { Alert, MumbleDetail, TextBoxComponent } from '@/components';
import { Container } from '@smartive-education/design-system-component-library-yeahyeahyeah';
import { fetchUser, User } from '@/services';
import { useSession } from 'next-auth/react';
import { fetchSingleMumble } from '@/services/fetchSingleMumble';
import { RenderReplies } from '@/components/mumble/RenderReplies';
import { fetchReplies } from '@/services/fetchReplies';
import { getToken } from 'next-auth/jwt';
import { FetchReplies, FetchSingleMumble } from '@/types/fallback';

type Props = {
  id: string;
  fallback: { '/api/singleMumble': FetchSingleMumble };
  fallbackReplies: { '/api/replies': FetchReplies };
  fallbackUser: { '/api/user': User };
};

const swrConfig = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

export default function MumblePage({
  id,
  fallback,
  fallbackReplies,
  fallbackUser,
}: Props): InferGetServerSidePropsType<typeof getServerSideProps> {
  const { data: session }: any = useSession();

  const { data: mumble } = useSWR({ url: '/api/singleMumble', id, token: session?.accessToken }, fetchSingleMumble, {
    ...swrConfig,
    fallbackData: fallback['/api/singleMumble'],
    refreshInterval: 10000,
  });

  const { data: user }: any = useSWR({ url: '/api/user', id: mumble?.creator, token: session?.accessToken }, fetchUser, {
    ...swrConfig,
    fallbackData: fallbackUser['/api/user'],
  });

  const { data, error, mutate, isLoading } = useSWR({ url: '/api/replies', id, token: session?.accessToken }, fetchReplies, {
    fallbackData: fallbackReplies['/api/replies'],
    revalidateOnFocus: false,
    refreshInterval: 10000,
  });

  return (
    <>
      <NextSeo
        title={user && `${user.userName}'s reply`}
        description={mumble && `${mumble.text}`}
        canonical={process.env.NEXT_PUBLIC_URL}
      />
      <Container layout="box">
        {mumble && <MumbleDetail mumble={mumble} user={user} />}
        <Container layout="plain">
          <Alert />
        </Container>
        <TextBoxComponent id={id} variant="inline" mutate={mutate} data={data} />

        <RenderReplies isLoading={isLoading} error={error} mutate={mutate} data={data} />
      </Container>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, query: { id } }) => {
  const mumble: FetchSingleMumble = await fetchSingleMumble({ id: id as string });
  const replies: FetchReplies = await fetchReplies({ id: id as string });
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const user: User | string = token?.accessToken ? await fetchUser({ id: mumble.creator, token: token?.accessToken }) : '';

  return {
    props: {
      id,
      fallback: {
        '/api/singleMumble': mumble,
      },
      fallbackReplies: {
        '/api/replies': replies,
      },
      fallbackUser: {
        '/api/user': user || {
          userName: 'username',
          firstName: 'Unknown',
          lastName: 'User',
          avatarUrl: '',
        },
      },
    },
  };
};
