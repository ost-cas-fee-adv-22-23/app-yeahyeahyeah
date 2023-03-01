import tw from 'twin.macro';
import { Footer } from '../components/content/footer';
import { Navi } from '../components/navigation/navigation';

export type IDefaultLayout = React.DOMAttributes<HTMLDivElement>;

export const DefaultLayout: React.FC<IDefaultLayout> = ({ children }) => {
  return (
    <>
      <LayoutStyles>
        <Navi />
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
  items-start
  w-full
  h-screen
  pb-64
  bg-slate-200
`;
