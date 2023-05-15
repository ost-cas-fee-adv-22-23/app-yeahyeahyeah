import { fireEvent, render } from '@testing-library/react';
import { FormSettings } from '@/components/form/FormSettings';
import { Button } from '@smartive-education/design-system-component-library-yeahyeahyeah';

describe('FormSettings', () => {
  it('render Button component', () => {
    const { getByText } = render(
      <Button label="Button Label" color="slate" onClick={() => console.log('Button clicked!!!')} />
    );

    expect(getByText(/Button Label/i)).toBeInTheDocument();

    const logSpy = jest.spyOn(console, 'log');
    fireEvent.click(getByText('Button Label'));
    expect(logSpy).toHaveBeenCalledWith('Button clicked!!!');
  });

  it('render FormSettings component', () => {
    const { getByText } = render(<FormSettings handleClose={() => console.log('Close FormSettings')} />);

    expect(getByText(/Name und Vorname/i)).toBeInTheDocument();
    expect(getByText(/E-Mail/i)).toBeInTheDocument();
    expect(getByText(/Abbrechen/i)).toBeInTheDocument();
    expect(getByText(/Speichern/i)).toBeInTheDocument();

    const logSpy = jest.spyOn(console, 'log');
    fireEvent.click(getByText('Abbrechen'));
    expect(logSpy).toHaveBeenCalledWith('Close FormSettings');
  });
});
