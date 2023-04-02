import React from 'react';
import tw from 'twin.macro';
import { Footer, NavigationComponent } from '../components';

export type DefaultLayout = React.DOMAttributes<HTMLDivElement>;

export const DefaultLayout: React.FC<DefaultLayout> = ({ children }) => {
  return (
    <>
      <NavigationWrapper>
        <NavigationComponent />
      </NavigationWrapper>
      <LayoutStyles>{children}</LayoutStyles>
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
