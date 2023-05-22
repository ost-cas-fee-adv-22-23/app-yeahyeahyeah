import { renderHook, act } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import useSWRInfinite from 'swr/infinite';
import useSWR from 'swr';
import { useStream } from '@/hooks/useStream';
import { setupIntersectionObserverMock } from './intersectionObserverMock';
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
      id: '01GZDHPVQ0605K0YVPPEV0FQAC',
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

beforeEach(() => {
  setupIntersectionObserverMock();
});

// Mock the useSession hook
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

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

jest.mock('@/services', () => ({
  deleteMumble: jest.fn(),
}));

describe('useStream', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useSession as jest.Mock).mockReturnValue({ data: { accessToken: 'test-token' } });
  });

  it('should fetch data using useSWRInfinite with the correct parameters', () => {
    const fetcherMock = jest.fn();

    const fallbackData = mumblesResult;
    const limit = 2;
    const url = '/api/mumbles';
    const id = 'test-id';
    const hashtag = 'test-hashtag';
    const creator = { id: 'test-creator-id' };

    renderHook(() => useStream(url, limit, fallbackData, fetcherMock, id, hashtag, creator));

    expect(useSWRInfinite).toHaveBeenCalledWith(
      expect.any(Function),
      fetcherMock,
      expect.objectContaining({
        fallbackData: [fallbackData],
        revalidateOnFocus: false,
        refreshInterval: 60000,
        revalidateAll: false,
        parallel: true,
      })
    );
  });

  it('should return mumbles', async () => {
    const { result } = renderHook(() => useStream('/api/mumbles', 10, { count: 10, mumbles: [] }, jest.fn()));
    expect(result.current[0]).toEqual([mumblesResult]);
  });

  it('checkForNewMumbles should return true', async () => {
    const { result } = renderHook(() => useStream('/api/mumbles', 10, { count: 10, mumbles: [] }, jest.fn()));
    expect(result.current[0]).toEqual([mumblesResult]);
    expect(result.current[5]).toEqual(true);
  });

  it('quantityNewMumbles should return quantity of new mumbles', async () => {
    const { result } = renderHook(() => useStream('/api/mumbles', 10, { count: 10, mumbles: [] }, jest.fn()));
    expect(result.current[6]).toEqual('2 neue Mumbles');
  });

  it('checkForNewMumbles should return false', async () => {
    (useSWR as jest.Mock).mockReturnValue({ data: [] });
    const { result } = renderHook(() => useStream('/api/mumbles', 10, { count: 10, mumbles: [] }, jest.fn()));

    expect(result.current[0]).toEqual([mumblesResult]);
    expect(result.current[5]).toEqual(false);
  });

  it('should call the mutate function when handleDelete is called and deleteMumble succeeds', async () => {
    (fetcher.deleteMumble as jest.Mock).mockResolvedValue({ status: 204 });

    const mutateMock = jest.fn();
    (useSWRInfinite as jest.Mock).mockReturnValue({
      mutate: mutateMock,
    });

    const { result } = renderHook(() => useStream('/api/mumbles', 10, { count: 10, mumbles: [] }, jest.fn()));

    const handleDelete = result.current[8];
    await act(async () => {
      await handleDelete('mumble-id');
    });

    expect(mutateMock).toHaveBeenCalledTimes(1);
  });

  it('should not call the mutate function when handleDelete is called and deleteMumble fails', async () => {
    (fetcher.deleteMumble as jest.Mock).mockResolvedValue({ status: 500 });

    const mutateMock = jest.fn();
    (useSWRInfinite as jest.Mock).mockReturnValue({
      mutate: mutateMock,
    });

    const { result } = renderHook(() => useStream('/api/mumbles', 10, { count: 10, mumbles: [] }, jest.fn()));

    const handleDelete = result.current[8];
    await act(async () => {
      await handleDelete('mumble-id');
    });

    expect(mutateMock).toHaveBeenCalledTimes(0);
  });

  it('should call the mutate function when handleRefreshPage is called', async () => {
    const spyWindowOpen = jest.spyOn(window, 'scrollTo');
    spyWindowOpen.mockImplementation(jest.fn());

    const mutateMock = jest.fn();
    (useSWRInfinite as jest.Mock).mockReturnValue({
      mutate: mutateMock,
    });

    const { result } = renderHook(() => useStream('/api/mumbles', 10, { count: 10, mumbles: [] }, jest.fn()));
    const handleRefreshPage = result.current[9];

    await act(async () => {
      handleRefreshPage();
    });

    expect(mutateMock).toHaveBeenCalledTimes(1);
  });
});
