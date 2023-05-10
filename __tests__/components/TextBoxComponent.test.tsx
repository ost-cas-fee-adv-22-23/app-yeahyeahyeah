import { fireEvent, render } from '@testing-library/react';
import { TextBoxComponent } from '@/components/form/TextBoxComponent';
import { useSession } from 'next-auth/react';

const fallbackUserLoggedIn = {
  id: '201444056083988737',
  userName: 'tomschall',
  firstName: 'Thomas',
  lastName: 'Schallert',
  avatarUrl:
    'https://cas-fee-advanced-ocvdad.zitadel.cloud/assets/v1/179828644300980481/users/201444056083988737/avatar?v=ac6cfc0064df0865522b5df8bf6b84c6',
};

jest.mock('next-auth/react');

describe('TextBoxComponent', () => {
  (useSession as jest.Mock).mockReturnValue([false, false]);

  it('renders TextBoxComponent', () => {
    const { getByText, queryByText } = render(
      <TextBoxComponent variant="write" mutate={jest.fn} fallbackUserLoggedIn={fallbackUserLoggedIn} />
    );
    expect(getByText(/Hey, was läuft?/i)).toBeInTheDocument();
    expect(queryByText('Das Textfeld darf nicht leer sein.')).toBeNull();
    fireEvent.click(getByText('Absenden'));
    expect(getByText('Das Textfeld darf nicht leer sein.')).toBeInTheDocument();
  });
});
