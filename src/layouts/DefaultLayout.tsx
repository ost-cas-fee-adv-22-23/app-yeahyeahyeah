import tw from 'twin.macro';
import { Footer, NavigationComponent } from '../components';

export type IDefaultLayout = React.DOMAttributes<HTMLDivElement>;

export const DefaultLayout: React.FC<IDefaultLayout> = ({ children }) => {
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
