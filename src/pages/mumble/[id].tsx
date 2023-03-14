import React from 'react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import useSWR from 'swr';
import tw from 'twin.macro';
import { Alert, MumbleDetail, TextBoxComponent } from '@/components';
import { Container } from '@smartive-education/design-system-component-library-yeahyeahyeah';
import { fetchUser } from '@/services';
import { useSession } from 'next-auth/react';
import { fetchSingleMumble } from '@/services/fetchSingleMumble';
import { RenderReplies } from '@/components/mumble/RenderReplies';
import { fetchReplies } from '@/services/fetchReplies';
import { getToken } from 'next-auth/jwt';

type Props = {
  id: string;
  fallback: any;
  fallbackReplies: any;
  fallbackUser: any;
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
    <Container layout="box">
      {mumble && <MumbleDetail mumble={mumble} user={user} id={id} />}
      <Container layout="plain">
        <Alert />
      </Container>
      <TextBoxComponent id={id} variant="inline" mutate={mutate} data={data} />

      <RenderReplies isLoading={isLoading} error={error} mutate={mutate} data={data} />
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, query: { id } }) => {
  const mumble = await fetchSingleMumble({ id: id as string });
  const replies = await fetchReplies({ id: id as string });
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const user = token?.accessToken && (await fetchUser({ id: mumble.creator, token: token?.accessToken }));

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
        '/api/user': user,
      },
    },
  };
};

export const ArticleMumble = tw.article`flex flex-col justify-start items-start w-full bg-slate-white py-32 pt-16 px-16 sm:px-48 rounded-lg mb-16`;
export const ArticleHeader = tw.div`flex flex-row items-center gap-16 relative left-0 sm:-left-[86px] mb-32`;
export const ArticleHeaderContent = tw.div`flex flex-col`;
export const ArticleDatas = tw.div`flex flex-row gap-16`;
export const ArticleInteraction = tw.div`flex flex-row`;
