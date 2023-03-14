import React, { useState } from 'react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import useSWR from 'swr';
import tw from 'twin.macro';
import { fetchUser } from '@/services';
import { useSession } from 'next-auth/react';
import { fetchSingleMumble } from '@/services/fetchSingleMumble';
import { fetchReplies } from '@/services/fetchReplies';

import { data as myMumbles } from '../../../data/myMumbles.json';
import { data as myLikes } from '../../../data/myLikes.json';

import { MumbleHeader, MumblePost } from '@/components';
import { Container, Switch } from '@smartive-education/design-system-component-library-yeahyeahyeah';

type MumbleHeaderProps = {
  id: string;
  myMumbles: string[];
  myLikes: string[];
  fallback: any;
  fallbackReplies: any;
};

const swrConfig = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

export default function ProfilePage({
  id,
  fallback,
  fallbackReplies,
}: MumbleHeaderProps): InferGetServerSidePropsType<typeof getServerSideProps> {
  const { data: session }: any = useSession();
  const [selection, setselection] = useState('mumbles');
  const handleSelection = (value: string) => {
    console.log({ value });
    setselection(value);
  };

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

  return (
    <Container layout="plain">
      <MumbleHeader user={user} />

      <Switch
        fCallBack={(value) => handleSelection(value)}
        options={[
          {
            label: 'Deine Mumbles',
            value: 'mumbles',
          },
          {
            label: 'Deine Likes',
            value: 'likes',
          },
        ]}
        value="mumbles"
      />

      <SelectionWrapper>
        {/* User profile page */}
        {selection === 'mumbles' && (
          <>
            {myMumbles.map((data: any, idx: number) => (
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
        )}
        {selection === 'likes' && (
          <>
            {myLikes.map((data: any, idx: number) => (
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
        )}
        {/* End user profile page */}

        {/* Start profile page STRANGER */}
        <div tw="bg-pink-500 p-8 mb-16 rounded-md flex justify-center">
          <p tw="text-slate-white font-medium">TBD - Profile Page STRANGER - Lists only users mumbles</p>
        </div>
        {/* End profile  */}

        {/* Start profile page STRANGER */}
        <div tw="bg-violet-500 p-8 mb-16 rounded-md flex justify-center">
          <p tw="text-slate-white font-medium">TBD - Profile Page NEW USER - Lists recommended mumbles</p>
        </div>
        {/* End profile  */}
      </SelectionWrapper>
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

const SelectionWrapper = tw.div`mt-16 mb-16`;
