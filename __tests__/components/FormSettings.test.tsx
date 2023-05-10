import { render } from '@testing-library/react';
import { FormSettings } from '@/components/form/FormSettings';
import { Button } from '@smartive-education/design-system-component-library-yeahyeahyeah';

describe('FormSettings', () => {
  it('render component', () => {
    const { getByText } = render(<Button label="Button Label" color="slate" onClick={() => console.log('fickscheisse')} />);

    expect(getByText(/Button Label/i)).toBeInTheDocument();
  });

  it('render component', () => {
    const { getByText } = render(<FormSettings handleClose={() => console.log('handle close')} />);

    expect(getByText(/Name und Vorname/i)).toBeInTheDocument();
    expect(getByText(/E-Mail/i)).toBeInTheDocument();
    expect(getByText(/Abbrechen/i)).toBeInTheDocument();
    expect(getByText(/Speichern/i)).toBeInTheDocument();
  });
});
