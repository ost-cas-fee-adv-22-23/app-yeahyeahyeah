import React, { useState } from 'react';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';
import useSWR from 'swr';
import { fetchUser } from '@/services';
import { FormSettings } from '../form/FormSettings';
import {
  Avatar,
  Modal,
  MumbleLogo,
  NaviButton,
  Navigation,
  NavigationColumn,
  NavigationRow,
} from '@smartive-education/design-system-component-library-yeahyeahyeah';
import { LoadingSpinner } from '../loading/LoadingSpinner';

export const NavigationComponent: React.FC = () => {
  const { data: session }: any = useSession();
  const [open, setOpen] = useState(false);

  const { data: user, isLoading }: any = useSWR(
    { url: '/api/user', id: session?.user?.id, token: session?.accessToken },
    fetchUser,
    {
      revalidateOnFocus: false,
    }
  );

  const handleClick = () => {
    setOpen((open) => !open);
  };

  const handleClose = () => {
    setOpen((open) => !open);
  };

  return (
    <>
      <Navigation mbSpacing="32">
        <NavigationColumn>
          <Link href="/" title="Startpage" target="_self">
            <MumbleLogo isNavigation={true} color="white" alignment="horizontal" />
          </Link>
          {isLoading ? (
            <>
              <div tw="flex justify-center items-center w-[144px] h-64 sm:(w-[250px])">
                <LoadingSpinner fill="#fff" width={24} height={24} />
              </div>
            </>
          ) : (
            <NavigationRow>
              {user && (
                <>
                  <NaviButton
                    label="Profile"
                    variant="profile"
                    href={user.id ? `/profile/${user.id}` : '/landingpage'}
                    legacyBehavior={true}
                    passHref={true}
                    linkComponent={Link}
                  >
                    <Avatar
                      alt={user.userName ? `${user.userName}` : 'username'}
                      src={user.avatarUrl ? user.avatarUrl : '/avatar_default.png/'}
                      variant="small"
                    />
                  </NaviButton>
                  <NaviButton label="Settings" variant="default" icon="settings" onClick={handleClick} />
                </>
              )}
              {user && user.id ? (
                <NaviButton label="Logout" variant="default" icon="logout" onClick={() => signOut()} />
              ) : (
                <NaviButton label="Login" variant="default" icon="logout" onClick={() => signIn('zitadel')} />
              )}
            </NavigationRow>
          )}
        </NavigationColumn>
      </Navigation>
      <Modal label="Settings" isOpen={open} onClose={handleClose} wide="small">
        <FormSettings />
      </Modal>
    </>
  );
};
