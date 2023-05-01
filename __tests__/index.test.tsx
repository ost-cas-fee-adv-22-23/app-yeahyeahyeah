import React from 'react';
import { render } from '@testing-library/react';
import { Footer } from '../src/components/content/Footer';
import { Screen } from './Screen';
import './intersectionObserverMock';
import * as CL from '@smartive-education/design-system-component-library-yeahyeahyeah';
import { Paragraph as ParagraphComponent } from '@smartive-education/design-system-component-library-yeahyeahyeah';

// const ParagraphComponent = ({ name }: any) => (
//   <CL.Paragraph>
//     <p color="light" className="Paragraph__ParagraphStyles-sc-cyal1j-0 eEqKQR">
//       © 2023 CAS - Frontend Engineering Advanced
//     </p>
//   </CL.Paragraph>
// );

// jest.mock('@smartive-education/design-system-component-library-yeahyeahyeah', () => {
//   return {
//     Paragraph: ({ color, size, alignment }: any) => (
//       <p color="light" className="Paragraph__ParagraphStyles-sc-cyal1j-0 eEqKQR">
//         © 2023 CAS - Frontend Engineering Advanced
//       </p>
//     ),
//   };
// });

const Paragraph = ({ name }: any) => {
  return (
    <>
      <div>
        <p color="light" className="Paragraph__ParagraphStyles-sc-cyal1j-0 eEqKQR">
          © 2023 CAS - Frontend Engineering Advanced
        </p>
      </div>
    </>
  );
};

describe('Home', () => {
  it('renders a footer component', () => {
    const { container } = render((<Paragraph />) as any);
    const footer = container.getElementsByClassName('test');
    //expect(footer.length).toBe(0);
  });
});

describe('Hook', () => {
  it('renders a hook', () => {
    const { container } = render(<Screen />);
    const footer = container.getElementsByClassName('test');
    expect(footer.length).toBe(1);
  });
});
