import tw from 'twin.macro';
import Message from '../../data/content.json';
import { Heading, Paragraph } from '@smartive-education/design-system-component-library-yeahyeahyeah';

const InternalServerError: React.FC = () => {
  return (
    <Container>
      <Heading
        label={`${Message.alerts.internalServerError.title}`}
        size="default"
        color="pink"
        tag="h3"
        alignment="center"
        mbSpacing="0"
      />
      <Paragraph size="large" alignment="center">
        {`${Message.alerts.internalServerError.text}`}
      </Paragraph>
    </Container>
  );
};

export default InternalServerError;

const Container = tw.div`flex flex-col justify-center items-center w-full h-full px-16 container`;
