import React, { useState } from 'react';
import Image from 'next/legacy/image';
import tw, { styled } from 'twin.macro';
import Link from 'next/link';
import useSWR from 'swr';
import { imageLoader } from '@/utils';
import Message from '../../../data/content.json';
import { useSession } from 'next-auth/react';
import {
  Avatar,
  IconLink,
  ImageContainer,
  Modal,
  Paragraph,
  User,
} from '@smartive-education/design-system-component-library-yeahyeahyeah';
import { fetchUser, User as TUser } from '@/services';
import { swrConfig } from '@/config';

type HeaderProps = {
  creator: any;
  fallbackUser: TUser;
};

export const Header: React.FC<HeaderProps> = ({ creator, fallbackUser }) => {
  const { data: session }: any = useSession();
  const [open, setOpen] = useState(false);

  const imageSource = 'https://picsum.photos/640/360';

  const handleClick = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(!open);
  };

  const { data: user } = useSWR(
    session?.accessToken ? { url: '/api/user', id: creator.id, token: session?.accessToken } : null,
    fetchUser,
    {
      ...swrConfig,
      fallbackData: fallbackUser,
    }
  );

  return (
    <>
      <HeaderWrapper>
        <ImageWrapper>
          <ImageContainer
            alt="This is a profile picture"
            src={imageSource}
            type="banner-view"
            onImageIconClick={() => handleClick()}
          />
        </ImageWrapper>
        <Modal label="Mumble" isOpen={open} onClose={handleClose} wide="full">
          <Image
            loader={imageLoader}
            src={imageSource}
            alt="This is a profile picture"
            width="600"
            height="600"
            layout="intrinsic"
            priority
            objectFit="contain"
            placeholder="empty"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
            quality={60}
          />
        </Modal>
        <AvatarWrapper>
          <Avatar
            variant="xlarge"
            src={user.avatarUrl ? user.avatarUrl : `${Message.contents.defaultAvatar.image}`}
            alt={user.userName}
          />
        </AvatarWrapper>
        <UserDataWrapper>
          <User label={`${user.firstName} ${user.lastName}`} variant="xlarge" />
          <InteractionWrapper>
            <IconLink
              label={`${user.userName}`}
              type="username"
              color="violet"
              href={`/profile/${user.id}`}
              legacyBehavior
              passHref
              linkComponent={Link}
            />

            <IconLink color="slate" href="#" label={'Switzerland'} onClick={function noRefCheck() {}} type="location" />
            <IconLink
              label={'a long long time ago...'}
              type="joined"
              color="slate"
              href={'#'}
              legacyBehavior
              passHref
              linkComponent={Link}
            />
          </InteractionWrapper>
        </UserDataWrapper>
      </HeaderWrapper>
      <UserDataWrapper>
        <Paragraph
          size="medium"
          color="light"
          mbSpacing="0"
        >{`Hallo! Mein Name ist ${user.firstName} ${user.lastName}. ${Message.contents.profileHeader.text}`}</Paragraph>
      </UserDataWrapper>
    </>
  );
};

const HeaderWrapper = tw.div`flex flex-col`;
const ImageWrapper = tw.div`flex flex-row justify-end items-center z-0 w-full mt-0 aspect-video`;
const AvatarWrapper = styled.div(() => [
  tw`flex flex-row justify-end items-end relative top-16 -right-32 z-0 scale-75 transform transition duration-500 h-0`,
  tw`sm:(relative scale-100 top-40 right-32)`,
]);
const InteractionWrapper = tw.div`flex flex-wrap sm:(flex-row) mb-16 gap-16`;
const UserDataWrapper = tw.div`relative top-0 px-8 sm:-top-24`;
