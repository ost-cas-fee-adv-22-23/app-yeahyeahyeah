import React from 'react';
import { render, screen } from '@testing-library/react';
import { Stream } from '@/components';
import { useSession } from 'next-auth/react';
import { setupIntersectionObserverMock } from '../hooks/intersectionObserverMock';
import * as fetcher from '@/services';

export const mumblesResult: {
  count: number;
  mumbles: fetcher.Mumble[];
} = {
  count: 375,
  mumbles: [
    {
      id: '01GZDK2FQCMAVAGDBBAFHB6ZFA',
      creator: '210233754319323393',
      text: '☕️',
      mediaUrl: 'https://storage.googleapis.com/qwacker-api-prod-data/40ff8b4a-f762-4df1-ad27-b4fc3b0f6463',
      mediaType: 'image/png',
      likeCount: 1,
      likedByUser: false,
      type: 'post',
      replyCount: 1,
      createdTimestamp: 1683009650412,
    },
    {
      id: '01GZDHPVQ0605K0YVPPEV0FQAZ',
      creator: '195305735549092097',
      text: 'Guten Morgen!',
      mediaUrl: 'https://storage.googleapis.com/qwacker-api-prod-data/d2693fad-2f44-438b-90ae-ea2022b96d76',
      mediaType: 'image/jpeg',
      likeCount: 1,
      likedByUser: false,
      type: 'post',
      replyCount: 2,
      createdTimestamp: 1683008220896,
    },
  ],
};

export const newMumblesResult: {
  count: number;
  mumbles: fetcher.Mumble[];
} = {
  count: 2,
  mumbles: [
    {
      id: '01GZDK2FQCMAVAGDBBAFHB6ZAB',
      creator: '210233754319323393',
      text: 'Der erste neue Mumble!',
      mediaUrl: 'https://storage.googleapis.com/qwacker-api-prod-data/40ff8b4a-f762-4df1-ad27-b4fc3b0f6463',
      mediaType: 'image/png',
      likeCount: 9,
      likedByUser: false,
      type: 'post',
      replyCount: 1,
      createdTimestamp: 1683009650412,
    },
    {
      id: '01GZDHPVQ0605K0YVPPEV0FQAC',
      creator: '195305735549092097',
      text: 'Guten Morgen! Der zweite neue Mumble!',
      mediaUrl: 'https://storage.googleapis.com/qwacker-api-prod-data/d2693fad-2f44-438b-90ae-ea2022b96d76',
      mediaType: 'image/jpeg',
      likeCount: 4,
      likedByUser: false,
      type: 'post',
      replyCount: 2,
      createdTimestamp: 1683008220896,
    },
  ],
};

beforeEach(() => {
  setupIntersectionObserverMock();
});

jest.mock('next-auth/react');

// Mock the useSWRInfinite hook
jest.mock('swr/infinite', () =>
  jest.fn(() => ({
    data: [mumblesResult],
    error: undefined,
    isValidating: false,
    isLoading: false,
    mutate: jest.fn(),
  }))
);

// Mock the useSWR hook
jest.mock('swr', () =>
  jest.fn(() => ({
    data: newMumblesResult,
  }))
);

jest.mock('@/components/alert/Alert', () => ({
  Alert: () => {
    const AlertMock = 'div';
    return <AlertMock />;
  },
}));

describe('Stream', () => {
  it('Should render the stream component', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
    });

    const fetcherMock = jest.fn();

    render(<Stream url="/api/mumbles" limit={10} fallback={mumblesResult} fetcher={fetcherMock} />);

    expect(screen.getByText('Hey, was läuft?')).toBeInTheDocument();
    expect(screen.getByText('Willkommen auf Mumble')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna.'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Guten Morgen!')).toBeInTheDocument();
    expect(screen.getByText('☕️')).toBeInTheDocument();
  });

  it('Should render the stream component with hashtags', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
    });

    const fetcherMock = jest.fn();

    render(<Stream url="/api/mumbles" limit={10} fallback={mumblesResult} fetcher={fetcherMock} hashtag="hashtag" />);

    expect(screen.getByText('Latest Hashtags...')).toBeInTheDocument();
    expect(screen.getByText('...used by other users')).toBeInTheDocument();
  });

  it('Should render the stream component with id', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
    });

    const fetcherMock = jest.fn();

    render(
      <Stream url="/api/mumbles" limit={10} fallback={mumblesResult} fetcher={fetcherMock} id="01H0V0YBJHYG3MWFZS6KH45D6Q" />
    );

    expect(screen.getByText('Hey, was läuft?')).toBeInTheDocument();
  });
});
