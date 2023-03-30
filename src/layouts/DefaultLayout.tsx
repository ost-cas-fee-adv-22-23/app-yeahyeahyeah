import React from 'react';
import tw from 'twin.macro';
import { Footer, NavigationComponent } from '../components';

export type DefaultLayout = React.DOMAttributes<HTMLDivElement>;

export const DefaultLayout: React.FC<DefaultLayout> = ({ children }) => {
  return (
    <LayoutStyles>
      <NavigationWrapper>
        <NavigationComponent />
      </NavigationWrapper>
      {children}
      <Footer />
    </LayoutStyles>
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
  bg-slate-100
`;

const NavigationWrapper = tw.div`sticky top-0 w-full z-50`;
