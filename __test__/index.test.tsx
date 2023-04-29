import { render } from '@testing-library/react';
import { Footer } from '../src/components/content/Footer';
import { Screen } from './Screen';
import './intersectionObserverMock';

describe('Home', () => {
  it('renders a footer', () => {
    const { container } = render(<Footer />);

    const footer = container.getElementsByClassName('test');

    console.log(footer.length); // 👉️ 2

    expect(footer.length).toBe(1);
  });
});

describe('Hook', () => {
  it('renders a hook', () => {
    const { container } = render(<Screen />);

    const footer = container.getElementsByClassName('test');

    console.log(footer.length); // 👉️ 2

    expect(footer.length).toBe(1);
  });
});
