import React, { useState } from 'react';
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

      <div tw="mt-16 mb-16">
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
      </div>
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
