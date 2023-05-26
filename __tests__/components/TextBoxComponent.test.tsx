import { fireEvent, render, screen } from '@testing-library/react';
import { TextBoxComponent } from '@/components/form/TextBoxComponent';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';

const user = {
  id: '201444056083988737',
  userName: 'tomschall',
  firstName: 'Thomas',
  lastName: 'Schallert',
  avatarUrl:
    'https://cas-fee-advanced-ocvdad.zitadel.cloud/assets/v1/179828644300980481/users/201444056083988737/avatar?v=ac6cfc0064df0865522b5df8bf6b84c6',
};

jest.mock('next-auth/react');
jest.mock('swr');

jest.mock('@/services', () => {
  const original = jest.requireActual('@/services');
  return {
    ...original,
    alertService: {
      onAlert: jest.fn(),
      success: jest.fn(),
      error: jest.fn((error) => console.log(error)),
      info: jest.fn(),
      warn: jest.fn(),
      alert: jest.fn(),
      clear: jest.fn(),
    },
  };
});

describe('TextBoxComponent', () => {
  (useSession as jest.Mock).mockReturnValue({
    data: null,
  });

  (useSWR as jest.Mock).mockReturnValue({
    data: null,
    isLoading: false,
    error: false,
  });

  it('renders TextBoxComponent', () => {
    const { getByText, getByRole, queryByText } = render(
      <TextBoxComponent variant="write" mutate={jest.fn} fallbackUserLoggedIn={user} />
    );

    expect(getByText(/Hey, was läuft?/i)).toBeInTheDocument();
    expect(queryByText('Das Textfeld darf nicht leer sein.')).toBeNull();

    fireEvent.click(getByText('Absenden'));

    expect(getByText('Das Textfeld darf nicht leer sein.')).toBeInTheDocument();

    const textarea = getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Test' } });

    const logSpy = jest.spyOn(console, 'log');
    fireEvent.click(getByText('Absenden'));

    expect(logSpy).toHaveBeenCalledWith('Du musst angemeldet sein, um Mumbles zu posten!');
  });

  it("tests Modal that get's triggered inside TextBoxComponent", () => {
    const { getByText, getByRole, queryByText } = render(
      <TextBoxComponent variant="write" mutate={jest.fn} fallbackUserLoggedIn={user} />
    );

    expect(getByRole('dialog', { hidden: true })).toHaveAttribute('aria-modal', 'false');

    fireEvent.click(getByText('Bild hochladen'));

    expect(getByText('Datei hierhin ziehen ...')).toBeInTheDocument();
    expect(getByText('JPEG, GIF oder PNG, maximal 5 MB')).toBeInTheDocument();
    expect(getByText('... oder Datei auswählen')).toBeInTheDocument();
    expect(getByRole('dialog', { hidden: true })).toHaveAttribute('aria-modal', 'true');

    fireEvent.click(getByText('Abbrechen'));

    expect(getByRole('dialog', { hidden: true })).toHaveAttribute('aria-modal', 'false');
  });
});
