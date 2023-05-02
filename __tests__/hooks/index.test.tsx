import { render } from '@testing-library/react';
import { Footer } from '@/components/content/Footer';
import { Screen } from './Screen';
import './intersectionObserverMock';
import { Paragraph } from '@smartive-education/design-system-component-library-yeahyeahyeah';

describe('Paragraph Mock', () => {
  it('renders a mocked Paragraph component', () => {
    const { container } = render(<Paragraph> © 2023 CAS - Frontend Engineering Advanced</Paragraph>);
    expect(container.textContent).toBe(' © 2023 CAS - Frontend Engineering Advanced');
  });
});

describe('Footer Component', () => {
  it('renders a footer component', () => {
    const { container } = render(<Footer />);
    expect(container.textContent).toBe('© 2023 CAS - Frontend Engineering Advanced');
  });
});

describe('useOnScreen Hook initial value', () => {
  it('renders useOnScreen hook with initial value false', () => {
    const { container } = render(<Screen />);
    const element = container.getElementsByClassName('is_on_screen');
    expect(element.length).toBe(1);
    expect(element[0].textContent).toBe('false');
  });
});

describe('useOnScreen Hook set value to true', () => {
  it('renders useOnScreen hook with value true', () => {
    const { container } = render(<Screen setTo={true} />);
    const element = container.getElementsByClassName('is_on_screen');
    expect(element.length).toBe(1);
    expect(element[0].textContent).toBe('true');
  });
});

describe('useOnScreen Hook set value to false', () => {
  it('renders useOnScreen hook with value false', () => {
    const { container } = render(<Screen setTo={false} />);
    const element = container.getElementsByClassName('is_on_screen');
    expect(element.length).toBe(1);
    expect(element[0].textContent).toBe('false');
  });
});
