import tw from 'twin.macro';
import { Heading } from '@smartive-education/design-system-component-library-yeahyeahyeah';

export const WelcomeText: React.FC = () => {
  return (
    <div tw="mb-16 px-8">
      <Heading label="Willkommen auf Mumble" color="violet" tag="h1" size="default" mbSpacing="8" />
      <ParagraphWrapper>
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore
        magna.
      </ParagraphWrapper>
    </div>
  );
};

const ParagraphWrapper = tw.p`text-lg font-semibold text-slate-500 leading-relaxed`;
