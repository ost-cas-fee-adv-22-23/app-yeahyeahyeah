import React from 'react';
import { render } from '@testing-library/react';
import ProfilePage from '../../src/pages/profile/[id]';
import { useSession } from 'next-auth/react';
import { setupIntersectionObserverMock } from '../hooks/intersectionObserverMock';
import * as fetcher from '@/services';
import { mumbleAPIResponse } from '../services/fetchUsers.test';

export const mumblesResult: {
  count: number;
  mumbles: fetcher.Mumble[];
} = {
  count: 375,
  mumbles: [
    {
      id: '01GZDK2FQCMAVAGDBBAFHB6ZFA',
      creator: '201444056083988737',
      text: '☕️',
      mediaUrl: 'https://storage.googleapis.com/qwacker-api-prod-data/40ff8b4a-f762-4df1-ad27-b4fc3b0f6463',
      mediaType: 'image/png',
      likeCount: 1,
      likedByUser: false,
      type: 'post',
      replyCount: 999,
      createdTimestamp: 1683009650412,
    },
    {
      id: '01GZDHPVQ0605K0YVPPEV0FQAZ',
      creator: '201444056083988737',
      text: 'Guten Morgen!',
      mediaUrl: 'https://storage.googleapis.com/qwacker-api-prod-data/d2693fad-2f44-438b-90ae-ea2022b96d76',
      mediaType: 'image/jpeg',
      likeCount: 1,
      likedByUser: false,
      type: 'post',
      replyCount: 999,
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
      creator: '201444056083988737',
      text: 'Der erste neue Mumble!',
      mediaUrl: 'https://storage.googleapis.com/qwacker-api-prod-data/40ff8b4a-f762-4df1-ad27-b4fc3b0f6463',
      mediaType: 'image/png',
      likeCount: 9,
      likedByUser: false,
      type: 'post',
      replyCount: 999,
      createdTimestamp: 1683009650412,
    },
    {
      id: '01GZDHPVQ0605K0YVPPEV0FQAC',
      creator: '201444056083988737',
      text: 'Guten Morgen! Der zweite neue Mumble!',
      mediaUrl: 'https://storage.googleapis.com/qwacker-api-prod-data/d2693fad-2f44-438b-90ae-ea2022b96d76',
      mediaType: 'image/jpeg',
      likeCount: 4,
      likedByUser: false,
      type: 'post',
      replyCount: 999,
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
    data: {
      id: '201444056083988737',
      userName: 'tomschall',
      firstName: 'Thomas',
      lastName: 'Schallert',
      avatarUrl: '',
    },
  }))
);

jest.mock('@/components/alert/Alert', () => ({
  Alert: () => {
    const AlertMock = 'div';
    return <AlertMock />;
  },
}));

jest.mock('next-auth/jwt', () => ({
  getToken: jest.fn(),
}));

describe('Page', () => {
  it('Should render the profile page', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
    });

    const { container, getByText } = render(
      <ProfilePage
        creator="201444056083988737"
        limit={10}
        fallbackUser={{
          id: '201444056083988737',
          userName: 'tomschall',
          firstName: 'Thomas',
          lastName: 'Schallert',
          avatarUrl: '',
        }}
        fallBackMyMumbles={mumblesResult}
        fallBackMyLikes={mumblesResult}
        fallbackUsers={mumbleAPIResponse}
      />
    );

    const element = container.getElementsByTagName('h3');

    expect(element[0].textContent).toBe('Mumble');
    expect(element[1].textContent).toBe('Thomas Schallert');

    const paragraph = container.getElementsByTagName('p');

    expect(paragraph[0].textContent).toBe(
      'Hallo! Mein Name ist Thomas Schallert. Ich freue mich mit Euch im CAS Frontend Engineering Advanced ' +
        'auszutauschen, Mumbles zu kreieren und zu bewerten. Ich freue mich auf jeden Like meiner Mumbles.'
    );

    const tab = container.getElementsByTagName('li');

    expect(tab[0].textContent).toBe('Deine Mumbles');
    expect(tab[1].textContent).toBe('Deine Likes');

    expect(getByText('☕️')).toBeInTheDocument();
    expect(getByText('Guten Morgen!')).toBeInTheDocument();
  });
});
