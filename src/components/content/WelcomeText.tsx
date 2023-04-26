import { Heading, Paragraph } from '@smartive-education/design-system-component-library-yeahyeahyeah';

export const WelcomeText: React.FC = () => {
  return (
    <div tw="mb-16">
      <Heading label="Willkommen auf Mumble" color="violet" tag="h2" size="default" mbSpacing="8" />
      <Paragraph color="light" size="large" mbSpacing="32">
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore
        magna.
      </Paragraph>
    </div>
  );
};
