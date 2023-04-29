import { render, screen } from '@testing-library/react';
import { Footer } from '../src/components/content/Footer';

describe('Home', () => {
  it('renders a footer', () => {
    const { container } = render(<Footer />);

    const footer = container.getElementsByClassName('test');

    console.log(footer.length); // 👉️ 2

    expect(footer.length).toBe(1);
  });
});
