import { Paragraph } from '@smartive-education/design-system-component-library-yeahyeahyeah';

export const Footer: React.FC = () => {
  const getCurrentYear = () => {
    return new Date().getFullYear();
  };

  return (
    <footer tw="flex flex-row justify-center items-center p-16 w-full z-0 overflow-hidden bg-slate-100">
      <Paragraph color="light" size="default" alignment="center">
        {`© ${getCurrentYear()} CAS - Frontend Engineer Advanced`}
      </Paragraph>
    </footer>
  );
};
