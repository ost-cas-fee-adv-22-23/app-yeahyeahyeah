import React, { ReactNode } from 'react';
import tw from 'twin.macro';
import { Footer, NavigationComponent } from '../components';
import { PageTransition } from '@/components';

interface DefaultLayoutProps {
  children: ReactNode;
}

export const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  return (
    <>
      <NavigationWrapper>
        <NavigationComponent />
      </NavigationWrapper>
      <LayoutStyles>
        <PageTransition>{children}</PageTransition>
      </LayoutStyles>
      <Footer />
    </>
  );
};

const LayoutStyles = tw.main`
  flex
  flex-col
  justify-start
  items-center
  m-0
  mx-auto
  p-0
`;

const NavigationWrapper = tw.div`sticky top-0 w-full z-50`;
