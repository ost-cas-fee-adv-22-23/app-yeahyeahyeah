import tw from 'twin.macro';
import { Footer, NavigationComponent } from '../components';

export type IDefaultLayout = React.DOMAttributes<HTMLDivElement>;

export const DefaultLayout: React.FC<IDefaultLayout> = ({ children }) => {
  return (
    <>
      <LayoutStyles>
        <NavigationComponent />
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
