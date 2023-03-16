import tw from 'twin.macro';
import Link from 'next/link';
import { Avatar, IconLink, ImageContainer, User } from '@smartive-education/design-system-component-library-yeahyeahyeah';
import useSWR from 'swr';
import { fetchUser, User as TUser } from '@/services';
import { useSession } from 'next-auth/react';

type MumbleHeaderProps = {
  creator: any;
  fallbackUser: { '/api/user': TUser };
};

const swrConfig = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

export const MumbleHeader = ({ creator, fallbackUser }: MumbleHeaderProps) => {
  const { data: session }: any = useSession();
  const handleImageIconClick = () => {
    console.log('image clicked', { name: 'MumbleHeaderIconClick' });
  };

  const { data: user } = useSWR({ url: '/api/user', id: creator.id, token: session?.accessToken }, fetchUser, {
    ...swrConfig,
    fallbackData: fallbackUser['/api/user'],
  });

  return (
    <>
      <MumbleHeaderWrapper>
        <ImageWrapper>
          <ImageContainer
            alt="This is a profile picture"
            onImageIconClick={handleImageIconClick}
            src="https://picsum.photos/640/360"
            type="banner-view"
          />
        </ImageWrapper>
        <AvatarWrapper>
          <Avatar variant="xlarge" src={user?.avatarUrl ? user.avatarUrl : '/avatar_default.png/'} alt="Username" />
        </AvatarWrapper>
        <User label={user && `${user.firstName} ${user.lastName}`} variant="xlarge" />
        <InteractionWrapper>
          <IconLink
            label={`${user && user.userName}`}
            type="username"
            color="violet"
            href={'#'}
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
      </MumbleHeaderWrapper>
    </>
  );
};

const MumbleHeaderWrapper = tw.div`flex flex-col`;
const ImageWrapper = tw.div`flex flex-row justify-end items-center z-0 w-full mt-0`;
const AvatarWrapper = tw.div`flex flex-row justify-end items-end relative top-32 -right-32 z-0 scale-75 transform transition duration-500 h-0 sm:(scale-100 relative top-64 right-32)`;
const InteractionWrapper = tw.div`flex flex-col sm:(flex-row) mb-16 gap-16`;
