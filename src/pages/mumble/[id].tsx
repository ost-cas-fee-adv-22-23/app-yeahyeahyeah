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

type Props = {
  id: string;
  fallback: any;
  fallbackReplies: any;
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
}: Props): InferGetServerSidePropsType<typeof getServerSideProps> {
  const { data: session }: any = useSession();

  const { data: mumble } = useSWR({ url: '/api/singleMumble', id, token: session?.accessToken }, fetchSingleMumble, {
    ...swrConfig,
    fallbackData: fallback['/api/singleMumble'],
    refreshInterval: 10000,
  });

  const { data: user }: any = useSWR(
    { url: '/api/user', id: mumble?.creator, token: session?.accessToken },
    fetchUser,
    swrConfig
  );

  const { data, error, mutate, isLoading } = useSWR({ url: '/api/replies', id, token: session?.accessToken }, fetchReplies, {
    fallbackData: fallbackReplies['/api/replies'],
    revalidateOnFocus: false,
  });

  return (
    <Container layout="box">
      {mumble && <MumbleDetail mumble={mumble} user={user} />}
      <Container layout="plain">
        <Alert />
      </Container>
      <TextBoxComponent id={id} variant="inline" mutate={mutate} data={data} />
      <RenderReplies data={data} error={error} isLoading={isLoading} mutate={mutate} />
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query: { id } }) => {
  const fetch = await fetchSingleMumble({ id: id as string });
  const replies = await fetchReplies({ id: id as string });

  console.log(fetch);

  return {
    props: {
      id,
      fallback: {
        '/api/singleMumble': fetch,
      },
      fallbackReplies: {
        '/api/replies': replies,
      },
    },
  };
};

export const ArticleMumble = tw.article`flex flex-col justify-start items-start w-full bg-slate-white py-32 pt-16 px-16 sm:px-48 rounded-lg mb-16`;
export const ArticleHeader = tw.div`flex flex-row items-center gap-16 relative left-0 sm:-left-[86px] mb-32`;
export const ArticleHeaderContent = tw.div`flex flex-col`;
export const ArticleDatas = tw.div`flex flex-row gap-16`;
export const ArticleInteraction = tw.div`flex flex-row`;
