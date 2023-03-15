import tw from 'twin.macro';
import Link from 'next/link';
import { elapsedTime } from '@/utils';
import { Avatar, IconLink, ImageContainer, User } from '@smartive-education/design-system-component-library-yeahyeahyeah';

type MumbleHeaderProps = {
  user: any;
};

export const MumbleHeader = ({ ...user }: MumbleHeaderProps) => {
  const handleImageIconClick = () => {
    console.log('image clicked', { name: 'MumbleHeaderIconClick' });
  };

  return (
    <MumbleHeaderWrapper>
      <ImageWrapper>
        <ImageContainer
          alt="This is a profile picture"
          onImageIconClick={handleImageIconClick}
          src="https://picsum.photos/640/360"
        />
      </ImageWrapper>
      <AvatarWrapper>
        <Avatar variant="xlarge" src={user.user.avatarUrl ? user.user.avatarUrl : '/avatar_default.png/'} alt="Username" />
      </AvatarWrapper>
      <User label={`${user.user.firstName} ${user.user.lastName}`} variant="xlarge" />
      <InteractionWrapper>
        <IconLink
          label={`${user.user.userName}`}
          type="username"
          color="violet"
          href={'#'}
          legacyBehavior
          passHref
          linkComponent={Link}
        />

        <IconLink color="slate" href="#" label={'Switzerland'} onClick={function noRefCheck() {}} type="location" />
        <IconLink
          label={elapsedTime(user.user.id)}
          type="joined"
          color="slate"
          href={'#'}
          legacyBehavior
          passHref
          linkComponent={Link}
        />
      </InteractionWrapper>
    </MumbleHeaderWrapper>
  );
};

const MumbleHeaderWrapper = tw.div`flex flex-col`;
const ImageWrapper = tw.div`flex flex-row justify-end items-end z-0 w-full relative top-0 mt-0 h-[340px]`;
const AvatarWrapper = tw.div`flex flex-row justify-end z-10 relative right-32 -top-108 h-0`;
const InteractionWrapper = tw.div`flex flex-col sm:(flex-row) mb-16 gap-16`;
