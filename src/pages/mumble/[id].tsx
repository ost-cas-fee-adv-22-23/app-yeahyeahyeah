import React, { useEffect, useState } from 'react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import useSWR, { SWRConfig } from 'swr';
import tw from 'twin.macro';
import { Alert, MumbleDetail, MumblePost, TextBoxComponent } from '@/components';
import { Container } from '@smartive-education/design-system-component-library-yeahyeahyeah';
import { fetchUser, Mumble } from '@/services';
import { useSession } from 'next-auth/react';
import { fetchSingleMumble } from '@/services/fetchSingleMumble';
import { RenderReplies } from '@/components/mumble/RenderReplies';

type Props = {
  id: string;
  fallback: any;
};

const swrConfig = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

export default function MumblePage({ id, fallback }: Props): InferGetServerSidePropsType<typeof getServerSideProps> {
  const { data: session }: any = useSession();
  const [reply, setReply] = useState<Mumble | null>(null);
  const [validate, setValidate] = useState(false);

  console.log('fallback', fallback);

  const { data: mumble } = useSWR({ url: '/api/singleMumble', id }, fetchSingleMumble, swrConfig);

  const { data: user }: any = useSWR(
    { url: '/api/user', id: mumble?.creator, token: session?.accessToken },
    fetchUser,
    swrConfig
  );

  useEffect(() => {
    setReply(null);
  }, [validate]);

  return (
    <SWRConfig value={fallback}>
      <Container layout="box">
        {mumble && <MumbleDetail mumble={mumble} user={user} />}
        <Container layout="plain">
          <Alert />
        </Container>
        <TextBoxComponent id={id} variant="inline" />

        {reply && (
          <MumblePost
            key={reply.id}
            id={reply.id}
            creator={reply.creator}
            text={reply.text}
            mediaUrl={reply.mediaUrl}
            createdTimestamp={reply.createdTimestamp}
            likeCount={reply.likeCount}
            likedByUser={reply.likedByUser}
            replyCount={reply.replyCount}
            type={reply.type}
          />
        )}

        <RenderReplies id={id} setValidate={setValidate} />
      </Container>
    </SWRConfig>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query: { id } }) => {
  const fetch = await fetchSingleMumble({ id: id as string });

  console.log(fetch);

  return {
    props: {
      id,
      fallback: {
        '/api/singleMumble': fetch,
      },
    },
  };
};

export const ArticleMumble = tw.article`flex flex-col justify-start items-start w-full bg-slate-white py-32 pt-16 px-16 sm:px-48 rounded-lg mb-16`;
export const ArticleHeader = tw.div`flex flex-row items-center gap-16 relative left-0 sm:-left-[86px] mb-32`;
export const ArticleHeaderContent = tw.div`flex flex-col`;
export const ArticleDatas = tw.div`flex flex-row gap-16`;
export const ArticleInteraction = tw.div`flex flex-row`;
