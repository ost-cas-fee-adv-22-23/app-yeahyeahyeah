import React, { useState } from 'react';
import tw from 'twin.macro';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

import { data as myMumbles } from '../../../data/myMumbles.json';
import { data as myLikes } from '../../../data/myLikes.json';

import { MumbleHeader, MumblePost } from '@/components';
import { Container, Switch } from '@smartive-education/design-system-component-library-yeahyeahyeah';

type MumbleHeaderProps = {
  alias: string;
  myMumbles: string[];
  myLikes: string[];
};

export default function ProfilePage({ alias }: MumbleHeaderProps): InferGetServerSidePropsType<typeof getServerSideProps> {
  const [selection, setselection] = useState('mumbles');
  const handleSelection = (value: string) => {
    console.log({ value });
    setselection(value);
  };
  return (
    <Container layout="plain">
      <MumbleHeader alias={alias} />

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

export const getServerSideProps: GetServerSideProps = async ({ query: { alias } }) => {
  return {
    props: {
      profile: { alias },
    },
  };
};

const SelectionWrapper = tw.div`mt-16 mb-16`;
