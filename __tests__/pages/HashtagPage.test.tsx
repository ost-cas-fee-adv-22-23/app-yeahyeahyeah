import React from 'react';
import { getByTestId, render, waitFor } from '@testing-library/react';
import HashtagPage from '../../src/pages/search/[hashtag]';
import { useSession } from 'next-auth/react';
import { setupIntersectionObserverMock } from '../hooks/intersectionObserverMock';
import { mumbleAPIResponse } from '../services/fetchUsers.test';
import mockAxios from 'jest-mock-axios';
import { Mumble, RawMumble } from '@/services';

export const mumblesResult: {
  count: number;
  mumbles: Mumble[];
} = {
  count: 375,
  mumbles: [
    {
      id: '01GZDK2FQCMAVAGDBBAFHB6ZFA',
      creator: '201444056083988737',
      text: '#cake #coffee #morning',
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
      text: '#coffee #morning',
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

const mumblesSearchAPIResult: {
  data: {
    count: number;
    data: RawMumble[];
  };
} = {
  data: {
    count: 3,
    data: [
      {
        id: '01H0M925WW7KZWSMFDJZRD34D5',
        creator: '201164897906589953',
        text: 'Testing is not always fun #AntiHero',
        mediaUrl: null,
        mediaType: null,
        likeCount: 0,
        likedByUser: false,
        type: 'post',
        replyCount: 0,
      },
      {
        id: '01H0CYQKSQ5APMWV5JSD8JV5V1',
        creator: '213020830488068353',
        text: 'This test was brought to you by #Yeahyeahyeah',
        mediaUrl: null,
        mediaType: null,
        likeCount: 0,
        likedByUser: false,
        type: 'post',
        replyCount: 0,
      },
      {
        id: '01GZVK86D8Q6SCRSZA5X2RMSS8',
        creator: '213020830488068353',
        text: '#NoMasters',
        mediaUrl: null,
        mediaType: null,
        likeCount: 0,
        likedByUser: false,
        type: 'post',
        replyCount: 0,
      },
    ],
  },
};

beforeEach(() => {
  setupIntersectionObserverMock();

  mockAxios.post.mockImplementation((url): any => {
    if (url?.includes(`posts/search`)) {
      return Promise.resolve(mumblesSearchAPIResult);
    }
  });
});

jest.mock('next-auth/react');

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
  it('Should render the profile page', async () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
    });

    const { container, getByText, getAllByText } = render(
      <HashtagPage limit={10} fallback={mumblesResult} fallbackUsers={mumbleAPIResponse} hashtag="rappi" />
    );

    await waitFor(() => getByTestId(container, 'hashtag'));

    const headline = container.getElementsByTagName('h1');
    expect(headline[0].textContent).toBe('Latest Hashtags...');

    const description = container.getElementsByTagName('h2');
    expect(description[0].textContent).toBe('...used by other users');

    expect(getByText('#AntiHero')).toBeInTheDocument();
    expect(getByText('#Yeahyeahyeah')).toBeInTheDocument();
    expect(getByText('#NoMasters')).toBeInTheDocument();

    expect(getAllByText('#cake')[0]).toBeInTheDocument();
    expect(getAllByText('#coffee')[0]).toBeInTheDocument();
    expect(getAllByText('#morning')[0]).toBeInTheDocument();

    expect(getAllByText('#coffee')[1]).toBeInTheDocument();
    expect(getAllByText('#morning')[1]).toBeInTheDocument();
  });
});
