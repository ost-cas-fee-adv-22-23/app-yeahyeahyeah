import React from 'react';
import Link from 'next/link';
import {
  Avatar,
  IconLink,
  ImageContainer,
  Paragraph,
  Switch,
  User,
} from '@smartive-education/design-system-component-library-yeahyeahyeah';

interface MumbleHeaderProps {
  alias: string;
}

export const MumbleHeader: React.FC<MumbleHeaderProps> = ({ alias }) => {
  return (
    <>
      <div tw="flex flex-row justify-end items-end z-0 w-full relative top-0 mt-0">
        <ImageContainer type="banner-view" alt="image alt tag" src="https://placebeard.it/640x360" />
      </div>
      <div tw="flex flex-row justify-end z-10 relative right-32 -top-108 h-0">
        <Avatar variant="xlarge" src="https://media.giphy.com/media/cfuL5gqFDreXxkWQ4o/giphy.gif" alt="Username" />
      </div>
      <User label={'User Name'} variant="xlarge" />
      <div tw="flex flex-col sm:(flex-row) mb-16 gap-16">
        <IconLink
          label={'username'}
          type="username"
          color="violet"
          href={'#'}
          legacyBehavior
          passHref
          linkComponent={Link}
        />
        <IconLink
          label={'timestamp'}
          type="timestamp"
          color="slate"
          href={'#'}
          legacyBehavior
          passHref
          linkComponent={Link}
        />
        <IconLink
          label="Mitglied seit x Wochen"
          type="joined"
          color="slate"
          href={'#'}
          legacyBehavior
          passHref
          linkComponent={Link}
        />
      </div>
      <Paragraph text="Schreib was über dich!" color="default" mbSpacing="32" />
      <Switch
        fCallBack={(value) => console.log(value)}
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
        value="likes"
      />
    </>
  );
};
