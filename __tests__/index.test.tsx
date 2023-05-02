import React from 'react';
import tw from 'twin.macro';
import { render } from '@testing-library/react';
import { Footer } from '../src/components/content/Footer';
import { Screen } from './Screen';
import './intersectionObserverMock';
import { Paragraph } from '@smartive-education/design-system-component-library-yeahyeahyeah';

jest.mock('@smartive-education/design-system-component-library-yeahyeahyeah', () => {
  return {
    Paragraph: ({ size = 'medium', color = 'default', mbSpacing, children, alignment }: any) => (
      <p color="light" className="Paragraph__ParagraphStyles-sc-cyal1j-0 eEqKQR">
        © 2023 CAS - Frontend Engineering Advanced test
      </p>
    ),
  };
});

// jest.mock('twin.macro', () => {
//   return {
//     tw: {
//       footer: ({ children }: any) => <footer>{children}</footer>,
//       default: ({ children }: any) => <footer>{children}</footer>,
//     },
//   };
// });

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

// const DS: any = jest.genMockFromModule('@smartive-education/design-system-component-library-yeahyeahyeah');

// console.log('DS', DS);

// const ParagraphComponent: React.FC = () => {
//   return (
//     <>
//       <Paragraph>
//         <p color="light" className="Paragraph__ParagraphStyles-sc-cyal1j-0 eEqKQR">
//           © 2023 CAS - Frontend Engineering Advanced
//         </p>
//       </Paragraph>
//     </>
//   );
// };

//jest.mock('@smartive-education/design-system-component-library-yeahyeahyeah');

describe('Home', () => {
  it('renders a footer component', () => {
    const { container } = render(<Paragraph>test</Paragraph>);
    console.log('container', container);
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
