import React, { useEffect, useState } from 'react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import useSWR from 'swr';
import tw from 'twin.macro';
import { MumbleDetail, MumblePost } from '@/components';
import { Container } from '@smartive-education/design-system-component-library-yeahyeahyeah';
import { fetchUser, Mumble } from '@/services';
import { useSession } from 'next-auth/react';
import { fetchSingleMumble } from '@/services/fetchSingleMumble';
import { TextBoxReplyComponent } from '@/components/form/TextBoxReplyComponent';
import { RenderReplies } from '@/components/mumble/RenderReplies';

type Props = {
  id: string;
};

const swrConfig = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

export default function MumblePage({ id }: Props): InferGetServerSidePropsType<typeof getServerSideProps> {
  const { data: session }: any = useSession();
  const [reply, setReply] = useState<Mumble | null>(null);
  const [validate, setValidate] = useState(false);

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
    <Container layout="box">
      {mumble && <MumbleDetail mumble={mumble} user={user} />}
      <TextBoxReplyComponent id={id} variant="inline" setReply={setReply} />

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
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query: { id } }) => {
  console.log({ id });

  return {
    props: {
      id,
    },
  };
};

export const ArticleMumble = tw.article`flex flex-col justify-start items-start w-full bg-slate-white py-32 pt-16 px-16 sm:px-48 rounded-lg mb-16`;
export const ArticleHeader = tw.div`flex flex-row items-center gap-16 relative left-0 sm:-left-[86px] mb-32`;
export const ArticleHeaderContent = tw.div`flex flex-col`;
export const ArticleDatas = tw.div`flex flex-row gap-16`;
export const ArticleInteraction = tw.div`flex flex-row`;
