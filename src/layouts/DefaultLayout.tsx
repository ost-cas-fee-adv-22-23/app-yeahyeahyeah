import React from 'react';
import tw from 'twin.macro';
import { Footer, NavigationComponent } from '../components';
import { useRouter } from 'next/router';
import { StartScreen } from './StartScreen';

export type DefaultLayout = React.DOMAttributes<HTMLDivElement>;

export const DefaultLayout: React.FC<DefaultLayout> = ({ children }) => {
  const router = useRouter();

  if (router.pathname === '/landingpage') {
    return <StartScreen />;
  }

  return (
    <>
      <LayoutStyles>
        <NavigationWrapper>
          <NavigationComponent />
        </NavigationWrapper>
        {children}
        <Footer />
      </LayoutStyles>
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
