import { render } from '@testing-library/react';
import { Footer } from '@/components/content/Footer';
import { Screen } from './Screen';
import './intersectionObserverMock';
import { Paragraph } from '@smartive-education/design-system-component-library-yeahyeahyeah';

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
