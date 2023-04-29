import tw from 'twin.macro';

export const Footer: React.FC = () => {
  return (
    <FooterWrapper>
      <div className="test">abc</div>
    </FooterWrapper>
  );
};

const FooterWrapper = tw.footer`flex flex-row justify-center items-center p-8 pt-12 w-full z-0 overflow-hidden`;
