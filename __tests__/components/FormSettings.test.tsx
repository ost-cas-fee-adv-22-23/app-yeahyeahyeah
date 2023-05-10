import { fireEvent, render } from '@testing-library/react';
import { FormSettings } from '@/components/form/FormSettings';
import { Button } from 'node_modules/@smartive-education/design-system-component-library-yeahyeahyeah/dist/components/button/index.js';

describe('FormSettings', () => {
  it('render component', () => {
    //const { getByText } = render(<FormSettings handleClose={() => console.log('handle close')} />);
    const { getByText } = render(<Button label="Button Label" color="slate" />);

    expect(getByText(/Button Label/i)).toBeInTheDocument();

    // fireEvent.click(getByText('Confirm'));

    // expect(getByText('Confirmed!')).toBeInTheDocument();
  });
});
