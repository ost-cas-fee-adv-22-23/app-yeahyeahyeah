import { fireEvent, render } from '@testing-library/react';
import { TextBoxComponent } from '@/components/form/TextBoxComponent';

const fallbackUserLoggedIn = {
  id: '201444056083988737',
  userName: 'tomschall',
  firstName: 'Thomas',
  lastName: 'Schallert',
  avatarUrl:
    'https://cas-fee-advanced-ocvdad.zitadel.cloud/assets/v1/179828644300980481/users/201444056083988737/avatar?v=ac6cfc0064df0865522b5df8bf6b84c6',
};

describe('TextBoxComponent', () => {
  it('render component', () => {
    // const { getByText } = render(
    //   <TextBoxComponent variant="write" mutate={jest.fn} fallbackUserLoggedIn={fallbackUserLoggedIn} />
    // );
    // expect(getByText(/waiting/i)).toBeInTheDocument();
    // fireEvent.click(getByText('Confirm'));
    // expect(getByText('Confirmed!')).toBeInTheDocument();
  });
});
