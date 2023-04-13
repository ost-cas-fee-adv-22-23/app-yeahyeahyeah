import React, { ReactNode } from 'react';
import tw from 'twin.macro';
import { Footer, NavigationComponent } from '../components';
import { PageTransition } from '@/components';
import { useRouter } from 'next/router';

interface DefaultLayoutProps {
  children: ReactNode;
}

export const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  const router = useRouter();

  return (
    <>
      <NavigationWrapper>
        <NavigationComponent />
      </NavigationWrapper>
      <LayoutStyles>{router.pathname === '/' ? <PageTransition>{children}</PageTransition> : <>{children}</>}</LayoutStyles>
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
