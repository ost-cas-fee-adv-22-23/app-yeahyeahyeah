import React, { useState } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
// import tw from 'twin.macro';
import useSWR from 'swr';
import { fetchUser, fetchMumblesByCreator } from '@/services';
import { useSession } from 'next-auth/react';
import { fetchSingleMumble } from '@/services/fetchSingleMumble';
// import { RenderReplies } from '@/components/mumble/RenderReplies';
import { fetchReplies } from '@/services/fetchReplies';

import { data as myMumbles } from '../../../data/myMumbles.json';
import { data as myLikes } from '../../../data/myLikes.json';
// import { fetchSingleMumble } from '@/services/fetchSingleMumble';
// import { fetchReplies } from '@/services/fetchReplies';

import { MumbleHeader, MumblePost } from '@/components';
import { Container, Switch } from '@smartive-education/design-system-component-library-yeahyeahyeah';

type ProfileProps = {
  creator: any;
  fallback: any;
  fallbackReplies: any;
};

const swrConfig = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

export default function Page({ creator }: ProfileProps) {
  const { data: session }: any = useSession();
  const _id = creator?.id;
  console.log('creator', creator?.id);

  const { data: mumbles } = useSWR(
    { url: '/api/posts', limit: 100, offset: 0, creator: _id, token: session?.accessToken },
    fetchMumblesByCreator,
    {
      refreshInterval: 30000,
      revalidateOnFocus: false,
    }
  );

  console.log('MUMBLES', mumbles);

  return (
    <>
      <h1>Profilepage</h1>
      {mumbles?.mumbles.map((data: any, idx: number) => (
        <MumblePost
          key={idx}
          id={data.id}
          creator={data.creator}
          text={data.text || ''}
          mediaUrl={data.mediaUrl || ''}
          likeCount={data.likeCount || 0}
          createdTimestamp={123456}
          likedByUser={data.likedByUser || false}
          replyCount={data.replyCount || 0}
          type="post"
        />
      ))}
    </>
  );
}

export const getServerSideProps: GetServerSideProps<any> = async ({ query: id }: GetServerSidePropsContext) => {
  const profileID = id?.id;
  console.log('server creator', profileID);

  const fetch = await fetchMumblesByCreator({ limit: 100, offset: 0, creator: { id: id } });

  console.log(fetch);

  return {
    props: {
      creator: id,
    },
  };
};
