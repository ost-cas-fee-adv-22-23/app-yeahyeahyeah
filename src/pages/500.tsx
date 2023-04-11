import { Heading, Paragraph } from '@smartive-education/design-system-component-library-yeahyeahyeah';

const InternalServerError: React.FC = () => {
  return (
    <div tw="flex flex-col justify-center items-center w-full h-full px-16">
      <Heading
        label="Upps... Internal Server Error 500."
        size="default"
        color="pink"
        tag="h3"
        alignment="center"
        mbSpacing="0"
      />
      <Paragraph size="large" alignment="center">
        Da ist etwas schief gelaufen.
      </Paragraph>
    </div>
  );
};

export default InternalServerError;
