import React from 'react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { NextSeo } from 'next-seo';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import { getToken } from 'next-auth/jwt';
import { fetchUser, User, fetchSingleMumble, fetchReplies } from '@/services';
import { FetchMumbles, FetchSingleMumble } from '@/types/fallback';
import { Alert, MumbleDetail } from '@/components';
import { Container } from '@smartive-education/design-system-component-library-yeahyeahyeah';
import { RenderStream } from '@/components/stream/RenderStream';

type MumblePageProps = {
  limit: number;
  id: string;
  fallback: FetchSingleMumble;
  fallbackReplies: FetchMumbles;
  fallbackUser: User;
};

const swrConfig = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

const MumblePage = ({
  limit,
  id,
  fallback,
  fallbackReplies,
  fallbackUser,
}: MumblePageProps): InferGetServerSidePropsType<typeof getServerSideProps> => {
  const { data: session }: any = useSession();

  const { data: mumble } = useSWR({ url: '/api/singleMumble', id, token: session?.accessToken }, fetchSingleMumble, {
    ...swrConfig,
    fallbackData: fallback,
    refreshInterval: 10000,
  });

  const { data: user }: any = useSWR(
    session?.accessToken ? { url: '/api/user', id: mumble?.creator, token: session?.accessToken } : null,
    fetchUser,
    {
      ...swrConfig,
      fallbackData: fallbackUser,
    }
  );

  return (
    <>
      <NextSeo
        title={user && `${user.userName}'s reply`}
        description={mumble && `${mumble.text}`}
        canonical={process.env.NEXT_PUBLIC_URL}
      />
      <Container layout="plain">
        <Alert />
      </Container>
      <Container layout="box">
        {mumble && <MumbleDetail mumble={mumble} user={user} />}
        <Container layout="plain"></Container>
        <RenderStream url="/api/replies" id={id} limit={limit} fallback={fallbackReplies} fetcher={fetchReplies} />
      </Container>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, query: { id } }) => {
  const token = await getToken({ req });
  const mumble: FetchSingleMumble = await fetchSingleMumble({ id: id as string, token: token?.accessToken });
  const mumbles: FetchMumbles = await fetchReplies({ id: id as string, token: token?.accessToken });

  const user: User | string = token?.accessToken ? await fetchUser({ id: mumble.creator, token: token?.accessToken }) : '';

  return {
    props: {
      // TODO: There is no limit and offset for replies yet (missing in the API)
      limit: 100,
      id,
      fallback: mumble,
      fallbackReplies: mumbles,
      fallbackUser: user || {
        userName: 'username',
        firstName: 'Unknown',
        lastName: 'User',
        avatarUrl: '',
      },
    },
  };
};

export default MumblePage;
