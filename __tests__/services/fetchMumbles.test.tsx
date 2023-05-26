import mockAxios from 'jest-mock-axios';
import { fetchMumbles } from '@/services/fetchMumbles';
import { Mumble, QwackerMumbleResponse } from '@/services';

type QwackerMumbleResponseNextURL = { next: string };

const mumblesAPIResponse: { data: QwackerMumbleResponse & QwackerMumbleResponseNextURL } = {
  data: {
    count: 375,
    data: [
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
      },
    ],
    next: '//qwacker-api-http-prod-4cxdci3drq-oa.a.run.app/posts?offset=2&limit=2',
  },
};

const mumblesResult: {
  count: number;
  mumbles: Mumble[];
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

describe('Tests for fetchMumbles fetcher', () => {
  afterEach(() => {
    mockAxios.reset();
  });

  describe('when API call is successful', () => {
    it('should return a mumble list', async () => {
      mockAxios.get.mockResolvedValueOnce(mumblesAPIResponse);

      const result = await fetchMumbles({ limit: 2, offset: 0 });

      expect(mockAxios.get).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_QWACKER_API_URL}/posts?limit=2&offset=0`, {
        headers: { Authorization: null, 'content-type': 'application/json' },
      });
      expect(result).toEqual(mumblesResult);
    });
  });

  describe('when API call fails', () => {
    it('should throw an error when the response is not successful', async () => {
      const errorMessage = "Cannot read properties of null (reading 'data')";
      mockAxios.get.mockResolvedValueOnce(null);

      await expect(fetchMumbles({ limit: 2, offset: 0 })).rejects.toThrowError(errorMessage);
    });

    it('should throw a generic error when an unexpected error occurs', async () => {
      const message = 'Could not fetch mumbles';
      mockAxios.get.mockRejectedValueOnce(new Error(message));

      try {
        await fetchMumbles({});
      } catch (e) {
        expect(e).toEqual(new Error(message));
      }

      expect(mockAxios.get).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_QWACKER_API_URL}/posts?limit=10&offset=0`, {
        headers: { Authorization: null, 'content-type': 'application/json' },
      });
    });
  });
});
