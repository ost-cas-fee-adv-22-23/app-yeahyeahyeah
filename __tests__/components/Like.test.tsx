import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Like } from '@/components';
import { useSession } from 'next-auth/react';

const user = {
  id: '201444056083988737',
  userName: 'tomschall',
  firstName: 'Thomas',
  lastName: 'Schallert',
  avatarUrl:
    'https://cas-fee-advanced-ocvdad.zitadel.cloud/assets/v1/179828644300980481/users/201444056083988737/avatar?v=ac6cfc0064df0865522b5df8bf6b84c6',
};

jest.mock('next-auth/react');

describe('Like', () => {
  it('Should render the Like component', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user,
        expires: '2023-05-15T20:02:51.452Z',
        accessToken: '3bQROMmmI3Emlfs8h-8wZvXxt8Re5RYNkiNo6l4Lq5xIUzwpIdTbu-nVub_jDGgHq2Saaaa',
      },
    });

    const { container, getByText } = render(<Like id="01GZJVVFGNKBNGJQ0HHAE7B3Q9" favourite={true} quantity={123} />);

    expect(screen.getByText('123 Likes')).toBeInTheDocument();

    const svgFilled = container.querySelector('[class*=LikeButton__StyledHeartFilled]') as HTMLInputElement;
    expect(svgFilled).toBeInTheDocument();

    fireEvent.click(getByText('123 Likes'));

    expect(screen.getByText('122 Likes')).toBeInTheDocument();

    const svgOutlined = container.querySelector('[class*=LikeButton__StyledHeartOutlined]') as HTMLInputElement;
    expect(svgOutlined).toBeInTheDocument();
  });
});
