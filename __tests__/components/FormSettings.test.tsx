import { fireEvent, render } from '@testing-library/react';
import { FormSettings } from '@/components/form/FormSettings';

describe('FormSettings', () => {
  it('render component', () => {
    const { getByText } = render(<FormSettings handleClose={() => console.log('handle close')} />);

    // expect(getByText(/waiting/i)).toBeInTheDocument();

    // fireEvent.click(getByText('Confirm'));

    // expect(getByText('Confirmed!')).toBeInTheDocument();
  });
});
