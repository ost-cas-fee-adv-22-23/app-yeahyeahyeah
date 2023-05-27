import { fireEvent, render } from '@testing-library/react';
import { NavigationComponent } from '@/components';
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

describe('NavigationComponent', () => {
  it('Should render loading spinner', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
    });

    (useSWR as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      error: false,
    });

    const { container } = render(<NavigationComponent />);
    const className = 'NavigationComponent__LoadingWrapper-sc-qsjn10-0 hgFlge';

    expect(container.getElementsByClassName(className)[0].className).toBe(className);
    expect(container.getElementsByClassName(className)[1]).toBe(undefined);
  });

  it('Should render only login button', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
    });

    (useSWR as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: false,
    });

    const { getByText } = render(<NavigationComponent />);
    expect(getByText('Login')).toBeInTheDocument();
  });

  it('Open and close settings modal', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user,
        expires: '2023-05-15T20:02:51.452Z',
        accessToken: '3bQROMmmI3Emlfs8h-8wZvXxt8Re5RYNkiNo6l4Lq5xIUzwpIdTbu-nVub_jDGgHq2Saaaa',
      },
    });

    (useSWR as jest.Mock).mockReturnValue({
      data: {
        user,
      },
      isLoading: false,
    });

    const { getByRole, getByText } = render(<NavigationComponent />);
    expect(getByRole('dialog', { hidden: true })).toHaveAttribute('aria-modal', 'false');

    fireEvent.click(getByText('Settings'));
    expect(getByRole('dialog', { hidden: true })).toHaveAttribute('aria-modal', 'true');

    fireEvent.click(getByText('Abbrechen'));
    expect(getByRole('dialog', { hidden: true })).toHaveAttribute('aria-modal', 'false');
  });
});
