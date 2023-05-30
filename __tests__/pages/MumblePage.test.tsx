import React from 'react';
import { render } from '@testing-library/react';
import MumblePage from '../../src/pages/mumble/[id]';
import { useSession } from 'next-auth/react';
import { setupIntersectionObserverMock } from '../hooks/intersectionObserverMock';
import { mumbleAPIResponse } from '../services/fetchUsers.test';
import { Mumble, QwackerReplyResponse, QwackerSingleMumbleResponse } from '@/services';
import mockAxios from 'jest-mock-axios';

export const mumble: Mumble = {
  id: '01H1E7CYZ9YDY7Y9T9GXPD641H',
  creator: '201444056083988737',
  text: 'cat cat cat',
  mediaUrl: 'https://storage.googleapis.com/qwacker-api-prod-data/c5fa21e9-354a-4adb-9422-157b2997a25e',
  mediaType: 'image/gif',
  likeCount: 0,
  likedByUser: false,
  type: 'post',
  replyCount: 1,
  createdTimestamp: 1685178448873,
};

const mumbleSingleAPIResponse: QwackerSingleMumbleResponse = {
  data: {
    id: '01H1E7CYZ9YDY7Y9T9GXPD641H',
    creator: '201444056083988737',
    text: 'cat cat cat',
    mediaUrl: 'https://storage.googleapis.com/qwacker-api-prod-data/c5fa21e9-354a-4adb-9422-157b2997a25e',
    mediaType: 'image/gif',
    likeCount: 0,
    likedByUser: false,
    type: 'post',
    replyCount: 1,
  },
};

const repliesResult: QwackerReplyResponse = {
  count: 3,
  mumbles: [
    {
      id: '01GZ52SS8EZNEZ7J52GGP505V2',
      creator: '201444056083988737',
      text: 'Spaghetti Code',
      mediaUrl: 'https://storage.googleapis.com/qwacker-api-prod-data/3960123a-c4a5-41c5-9b7c-7b23a1c0c7fc',
      mediaType: 'image/jpeg',
      likeCount: 0,
      likedByUser: false,
      type: 'reply',
      parentId: '01GZ427TP4JFBFN8EZHWZH14V4',
      createdTimestamp: 1682724152590,
    },
    {
      id: '01GZ5217T85S6N8R05YZKP8H72',
      creator: '201444056083988737',
      text: '#Cleancodeisnice',
      mediaUrl: null,
      mediaType: null,
      likeCount: 0,
      likedByUser: false,
      type: 'reply',
      parentId: '01GZ427TP4JFBFN8EZHWZH14V4',
      createdTimestamp: 1682723348296,
    },
    {
      id: '01GZ51XZ13GQ9XC3P60QNM5Q41',
      creator: '201444056083988737',
      text: 'Wer, wo, was ? :-D',
      mediaUrl: null,
      mediaType: null,
      likeCount: 0,
      likedByUser: false,
      type: 'reply',
      parentId: '01GZ427TP4JFBFN8EZHWZH14V4',
      createdTimestamp: 1682723240995,
    },
  ],
};

export const newMumblesResult: {
  count: number;
  mumbles: Mumble[];
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
jest.mock('axios');

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

    mockAxios.get.mockImplementation((url): any => {
      if (url?.includes(`/posts/201444056083988737`)) {
        return Promise.resolve(mumbleSingleAPIResponse);
      }
      if (url?.includes(`/posts/201444056083988737/replies`)) {
        return Promise.resolve(repliesResult);
      }
    });

    const { container, getByText } = render(
      <MumblePage
        id={'201444056083988737'}
        limit={10}
        fallbackUser={{
          id: '201444056083988737',
          userName: 'tomschall',
          firstName: 'Thomas',
          lastName: 'Schallert',
          avatarUrl: '',
        }}
        fallbackUsers={mumbleAPIResponse}
        fallbackUserLoggedIn={mumbleAPIResponse.data[0]}
        fallback={mumble}
        fallbackReplies={repliesResult}
      />
    );

    const element = container.getElementsByTagName('h4');

    expect(element[0].textContent).toBe('Thomas Schallert');
    expect(element[1].textContent).toBe('Hey, was läuft?');

    const detailPost = container.getElementsByTagName('article');

    const paragraph = container.getElementsByTagName('p');
    expect(paragraph[0].textContent).toBe('cat cat cat ');

    const user = detailPost[0].getElementsByTagName('div')[0].getElementsByTagName('a');

    expect(user[0].textContent).toBe('tomschall');
    expect(user[1].textContent).toBe('vor 3 Tagen');

    expect(getByText('Spaghetti Code')).toBeInTheDocument();
    expect(getByText('#Cleancodeisnice')).toBeInTheDocument();
    expect(getByText('Wer, wo, was ? :-D')).toBeInTheDocument();
  });
});
