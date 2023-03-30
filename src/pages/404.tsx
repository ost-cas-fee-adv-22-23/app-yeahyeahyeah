import { Heading, Paragraph } from '@smartive-education/design-system-component-library-yeahyeahyeah';

const PageNotFound: React.FC = () => {
  return (
    <div tw="flex flex-col justify-center items-center w-full h-full px-16">
      <Heading
        label="Upps... Seite nicht gefunden."
        size="default"
        color="violet"
        tag="h3"
        alignment="center"
        mbSpacing="0"
      />
      <Paragraph size="large" alignment="center">
        Die angeforderte Seite existiert nicht.
      </Paragraph>
    </div>
  );
};

export default PageNotFound;
