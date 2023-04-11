import tw from 'twin.macro';
import Message from '../../data/content.json';
import { Heading, Paragraph } from '@smartive-education/design-system-component-library-yeahyeahyeah';

const PageNotFound: React.FC = () => {
  return (
    <ContentWrapper>
      <Heading
        label={`${Message.contents.pageNotFound.label}`}
        size="default"
        color="violet"
        tag="h3"
        alignment="center"
        mbSpacing="0"
      />
      <Paragraph size="large" alignment="center">
        {`${Message.contents.pageNotFound.text}`}
      </Paragraph>
    </ContentWrapper>
  );
};

export default PageNotFound;

const ContentWrapper = tw.div`flex flex-col justify-center items-center w-full h-full px-16`;
