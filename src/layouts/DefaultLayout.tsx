import tw from 'twin.macro';
import { Footer, NavigationComponent } from '../components';
import { useRouter } from 'next/router';

export type IDefaultLayout = React.DOMAttributes<HTMLDivElement>;

export const DefaultLayout: React.FC<IDefaultLayout> = ({ children }) => {
  const route = useRouter();

  console.log(route.pathname);

  return (
    <>
      {route.pathname !== '/landingpage' && (
        <LayoutStyles>
          <NavigationWrapper>
            <NavigationComponent />
          </NavigationWrapper>
          {children}
          <Footer />
        </LayoutStyles>
      )}
      {children}
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
