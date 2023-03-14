import React, { useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  Avatar,
  Modal,
  MumbleLogo,
  NaviButton,
  Navigation,
  NavigationColumn,
  NavigationRow,
} from '@smartive-education/design-system-component-library-yeahyeahyeah';
import { FormSettings } from '../form/FormSettings';

export const NavigationComponent: React.FC = () => {
  const { data: session }: any = useSession();
  const [open, setOpen] = useState(false);

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
          <NavigationRow>
            {session && (
              <>
                <NaviButton
                  label="Profile"
                  variant="profile"
                  href={session?.user?.id && `/profile/${session.user?.id}`}
                  legacyBehavior={true}
                  passHref={true}
                  linkComponent={Link}
                >
                  <Avatar
                    alt="Small Avatar"
                    src="https://media.giphy.com/media/cfuL5gqFDreXxkWQ4o/giphy.gif"
                    variant="small"
                  />
                </NaviButton>
                <NaviButton label="Settings" variant="default" icon="settings" onClick={handleClick} />
              </>
            )}
            {!session && <NaviButton label="Login" variant="default" icon="logout" onClick={() => signIn('zitadel')} />}
            {!!session && <NaviButton label="Logout" variant="default" icon="heart-filled" onClick={() => signOut()} />}
          </NavigationRow>
        </NavigationColumn>
      </Navigation>
      <Modal label="Settings" isOpen={open} onClose={handleClose}>
        <FormSettings />
      </Modal>
    </>
  );
};
