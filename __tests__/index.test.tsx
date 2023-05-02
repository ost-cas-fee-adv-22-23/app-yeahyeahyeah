import { render } from '@testing-library/react';
import { Footer } from '@/components/content/Footer';
import { Screen } from './Screen';
import './intersectionObserverMock';
import { Paragraph } from '@smartive-education/design-system-component-library-yeahyeahyeah';

// jest.mock('twin.macro', () => {
//   return {
//     tw: {
//       footer: jest.fn,
//       default: jest.fn,
//       _twinMacro: { default: { footer: jest.fn } },
//     },
//     _twinMacro: { default: { footer: jest.fn } },
//   } as any;
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
    const { container } = render(<Paragraph> © 2023 CAS - Frontend Engineering Advanced test</Paragraph>);
    const { container: cont } = render(<Footer />);
    console.log('container', container.innerHTML);
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
