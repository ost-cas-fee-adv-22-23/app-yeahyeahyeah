import React from 'react';
import { ImageContainer, User, IconLink, Paragraph } from '@smartive-education/design-system-component-library-yeahyeahyeah';

interface MumbleHeaderProps {
  alias: string;
}

export const MumbleHeader: React.FC<MumbleHeaderProps> = ({ alias }) => {
  return (
    <>
      <ImageContainer type="banner-view" alt="image alt tag" src="https://placebeard.it/640x360" />
      <User label={alias} variant="xlarge" />
      <div tw="flex flex-col sm:(flex-row) mb-16 gap-16">
        <IconLink label={alias} type="username" color="violet" />
        <IconLink label="location" type="location" color="slate" />
        <IconLink label="joined" type="joined" color="slate" />
      </div>
      <Paragraph text="Schreib was über dich!" color="default" mbSpacing="32" />
    </>
  );
};
