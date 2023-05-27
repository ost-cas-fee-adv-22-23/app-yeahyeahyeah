import mockAxios from 'jest-mock-axios';
import { fetchMyLikes } from '@/services/fetchMyLikes';
import { Mumble, QwackerMumbleResponse } from '@/services';

type QwackerMumbleResponseNextURL = { next: string };

const token = 'LPwnxnvQNBkn5DabtZ_env74EPct7UD3IgIXPftR1YoSX6QMfvhOSw819eX6CU5m7SPAAAA';

const mumblesAPIResponse: { data: QwackerMumbleResponse & QwackerMumbleResponseNextURL } = {
  data: {
    count: 3,
    data: [
      {
        id: '01GWSDWX2AMF0MW2HQWC2DYQZY',
        creator: '201444056083988737',
        text: '#hatersgonnahate #sickofitall #freedomfighters',
        mediaUrl: 'https://storage.googleapis.com/qwacker-api-prod-data/7f5cd307-5112-4104-a112-9d1fe7d28d5f',
        mediaType: 'image/gif',
        likeCount: 3,
        likedByUser: true,
        type: 'post',
        replyCount: 1,
      },
      {
        id: '01GWHRKW2XZRCXKCSZQ7VTXNJM',
        creator: '201161756305785089',
        text: 'Me vs. reality!',
        mediaUrl: 'https://storage.googleapis.com/qwacker-api-prod-data/9bb5b849-f511-47b8-86da-74f7866255c3',
        mediaType: 'image/jpeg',
        likeCount: 3,
        likedByUser: true,
        type: 'post',
        replyCount: 0,
      },
      {
        id: '01GWHRDD19B5PX87HNZ2V3SEVH',
        creator: '201161756305785089',
        text: '...',
        mediaUrl: 'https://storage.googleapis.com/qwacker-api-prod-data/e5590036-0bfb-40cc-ab2e-a3ae7ef51133',
        mediaType: 'image/png',
        likeCount: 1,
        likedByUser: true,
        type: 'post',
        replyCount: 1,
      },
    ],
    next: '//qwacker-api-http-prod-4cxdci3drq-oa.a.run.app/posts?offset=2&limit=2',
  },
};

const mumblesResult: {
  count: number;
  mumbles: Mumble[];
} = {
  count: 3,
  mumbles: [
    {
      id: '01GWSDWX2AMF0MW2HQWC2DYQZY',
      creator: '201444056083988737',
      text: '#hatersgonnahate #sickofitall #freedomfighters',
      mediaUrl: 'https://storage.googleapis.com/qwacker-api-prod-data/7f5cd307-5112-4104-a112-9d1fe7d28d5f',
      mediaType: 'image/gif',
      likeCount: 3,
      likedByUser: true,
      type: 'post',
      replyCount: 1,
      createdTimestamp: 1680185652298,
    },
    {
      id: '01GWHRKW2XZRCXKCSZQ7VTXNJM',
      creator: '201161756305785089',
      text: 'Me vs. reality!',
      mediaUrl: 'https://storage.googleapis.com/qwacker-api-prod-data/9bb5b849-f511-47b8-86da-74f7866255c3',
      mediaType: 'image/jpeg',
      likeCount: 3,
      likedByUser: true,
      type: 'post',
      replyCount: 0,
      createdTimestamp: 1679928455261,
    },
    {
      id: '01GWHRDD19B5PX87HNZ2V3SEVH',
      creator: '201161756305785089',
      text: '...',
      mediaUrl: 'https://storage.googleapis.com/qwacker-api-prod-data/e5590036-0bfb-40cc-ab2e-a3ae7ef51133',
      mediaType: 'image/png',
      likeCount: 1,
      likedByUser: true,
      type: 'post',
      replyCount: 1,
      createdTimestamp: 1679928243241,
    },
  ],
};

describe('Tests for fetchMyMumbles fetcher', () => {
  afterEach(() => {
    mockAxios.reset();
  });

  describe('when API call is successful', () => {
    it('should return a mumble list', async () => {
      mockAxios.get.mockResolvedValueOnce(mumblesAPIResponse);

      const result = await fetchMyLikes({ limit: 10, offset: 0, token });

      expect(mockAxios.get).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_QWACKER_API_URL}/posts?limit=10&offset=0`, {
        headers: {
          Authorization: 'Bearer LPwnxnvQNBkn5DabtZ_env74EPct7UD3IgIXPftR1YoSX6QMfvhOSw819eX6CU5m7SPAAAA',
          'content-type': 'application/json',
        },
      });
      expect(result).toEqual(mumblesResult);
    });
  });

  describe('when API call fails', () => {
    it('should throw an error when the response is not successful', async () => {
      const errorMessage = "Cannot read properties of null (reading 'data')";
      mockAxios.get.mockResolvedValueOnce(null);

      await expect(fetchMyLikes({ limit: 10, offset: 0, token })).rejects.toThrowError(errorMessage);
    });

    it('should throw a generic error when an unexpected error occurs', async () => {
      const message = 'Could not fetch mumbles';
      mockAxios.get.mockRejectedValueOnce(new Error(message));

      try {
        await fetchMyLikes({});
      } catch (e) {
        expect(e).toEqual(new Error(message));
      }

      expect(mockAxios.get).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_QWACKER_API_URL}/posts?limit=1000&offset=0`, {
        headers: {
          Authorization: null,
          'content-type': 'application/json',
        },
      });
    });
  });
});
