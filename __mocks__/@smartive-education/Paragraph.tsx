import { IParagraphProps } from '@smartive-education/design-system-component-library-yeahyeahyeah';

export const Paragraph = ({ size = 'medium', color = 'default', mbSpacing, children, alignment }: IParagraphProps) => (
  <p color="light" className="Paragraph__ParagraphStyles-sc-cyal1j-0 eEqKQR">
    {children}
  </p>
);
