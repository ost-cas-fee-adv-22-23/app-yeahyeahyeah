import { render, screen } from '@testing-library/react';
import Test from './Test';

describe('Testing twin and styled components', () => {
  it('finds a predefined sentence', () => {
    render(<Test text="i like styled components" />);
    const text = screen.getByText(/i like styled components/);
    expect(text).toHaveTextContent('i like styled components');
  });

  it('finds all h1 tags rendered by twin and styled components', () => {
    const { container } = render(<Test text="i like styled components" />);
    const h1 = container.getElementsByTagName('h1');
    expect(h1.length).toEqual(1);
  });

  it('finds all div tags rendered by twin and styled components', () => {
    const { container } = render(<Test text="i like styled components" />);
    const div = container.getElementsByTagName('div');
    expect(div.length).toEqual(2);
  });

  it('finds specific classnames that get rendered with twin and styled components', () => {
    const { container } = render(<Test text="i like styled components" />);

    const StyledImportComponent = container.querySelector('[class*=Test__StyledImportComponent]');
    expect(StyledImportComponent).toBeInTheDocument();

    const TwImportComponent = container.querySelector('[class*=Test__TwImportComponent]');
    expect(TwImportComponent).toBeInTheDocument();

    const StyledDiv = container.querySelector('[class*=Test___StyledDiv]');
    expect(StyledDiv).toBeInTheDocument();
  });
});
