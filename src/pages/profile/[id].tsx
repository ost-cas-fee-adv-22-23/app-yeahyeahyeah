import React, { useState } from 'react';
import tw from 'twin.macro';
import useSWR from 'swr';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { fetchUser, fetchMyMumbles, fetchMyLikes } from '@/services';
import { useSession } from 'next-auth/react';
import { fetchSingleMumble } from '@/services/fetchSingleMumble';
// import { RenderReplies } from '@/components/mumble/RenderReplies';
import { fetchReplies } from '@/services/fetchReplies';

import { data as myMumbles } from '../../../data/myMumbles.json';
import { data as myLikes } from '../../../data/myLikes.json';
// import { fetchSingleMumble } from '@/services/fetchSingleMumble';
// import { fetchReplies } from '@/services/fetchReplies';
import { data as myLikes } from '../../../data/myLikes.json'; // tbd myLikes

import { LoadingSpinner, MumbleHeader, MumblePost } from '@/components';
import { Container, Switch } from '@smartive-education/design-system-component-library-yeahyeahyeah';

type MumbleHeaderProps = {
  creator: any;
  fallback: any;
  fallbackReplies: any;
};

const swrConfig = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

export default function Page({ creator }: MumbleHeaderProps) {
  const { data: session }: any = useSession();
  const [selection, setselection] = useState('mumbles');
  const _id = creator?.id;

  const handleSelection = (value: string) => {
    setselection(value);
  };

  const { data: user, isLoading } = useSWR({ url: '/api/user', id: _id, token: session?.accessToken }, fetchUser, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const { data: mumbles, isLoading: loadingMyMumbles } = useSWR(
    { url: '/api/posts', limit: 100, offset: 0, creator: _id, token: session?.accessToken },
    fetchMyMumbles,
    {
      ...swrConfig,
      refreshInterval: 30000,
      revalidateOnFocus: false,
    }
  );

  const { data: myLikes, isLoading: loadingMyLikes } = useSWR(
    { url: '/api/posts', limit: 100, offset: 0, token: session?.accessToken },
    fetchMyLikes,
    {
      ...swrConfig,
      refreshInterval: 30000,
      revalidateOnFocus: false,
    }
  );

  return (
    <Container layout="plain">
      {isLoading && <LoadingSpinner />}

      {user && <MumbleHeader user={user} />}

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
        {loadingMyMumbles && <LoadingSpinner />}
        {selection === 'mumbles' && (
          <>
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
        )}
        {loadingMyLikes && <LoadingSpinner />}
        {selection === 'likes' && (
          <>
            {myLikes?.mumbles.map((data: any, idx: number) => (
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

export const getServerSideProps: GetServerSideProps<any> = async ({ query: id }: GetServerSidePropsContext) => {
  const profileID = id?.id;
  console.log('server creator', profileID);

  const fetch = await fetchMyMumbles({ limit: 100, offset: 0, creator: { id: id } });

  console.log(fetch);

  return {
    props: {
      creator: id,
    },
  };
};

const SelectionWrapper = tw.div`mt-16 mb-16`;
