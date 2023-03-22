import { Paragraph } from '@smartive-education/design-system-component-library-yeahyeahyeah';

export const Footer: React.FC = () => {
  const getCurrentYear = () => {
    return new Date().getFullYear();
  };

  return (
    <footer tw="flex flex-row justify-center items-center p-16 w-full">
      <Paragraph
        text={`© ${getCurrentYear()} CAS - Frontend Engineer Advanced`}
        color="light"
        size="default"
        alignment="center"
      />
    </footer>
  );
};
