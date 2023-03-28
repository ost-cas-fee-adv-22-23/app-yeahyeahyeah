import React from 'react';
import tw from 'twin.macro';
import { Footer, NavigationComponent } from '../components';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { StartScreen } from './StartScreen';

export type DefaultLayout = React.DOMAttributes<HTMLDivElement>;

export const DefaultLayout: React.FC<DefaultLayout> = ({ children }) => {
  const router = useRouter();
  const { data: session }: any = useSession();
  const notAuthorized: boolean = session === undefined || (session === null && router.pathname === '/profile/[id]');

  return (
    <>
      {notAuthorized === false && (
        <LayoutStyles>
          <NavigationWrapper>
            <NavigationComponent />
          </NavigationWrapper>
          {children}
          <Footer />
        </LayoutStyles>
      )}
      {notAuthorized === true && <StartScreen />}
    </>
  );
};

const LayoutStyles = tw.div`
  flex
  flex-col
  justify-start
  items-center
  m-0
  mx-auto
  p-0
  bg-slate-200
`;

const NavigationWrapper = tw.div`sticky top-0 w-full z-50`;
