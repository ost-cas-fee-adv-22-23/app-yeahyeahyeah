import { Paragraph } from '@smartive-education/design-system-component-library-yeahyeahyeah';

export const Footer: React.FC = () => {
  return (
    <footer tw="flex flex-row justify-center items-center p-8 pt-12 w-full z-0 overflow-hidden">
      <Paragraph color="light" size="default" alignment="center">
        {`© 2023 CAS - Frontend Engineering Advanced`}
      </Paragraph>
    </footer>
  );
};
