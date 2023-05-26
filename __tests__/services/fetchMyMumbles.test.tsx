import mockAxios from 'jest-mock-axios';
import { fetchMyMumbles } from '@/services/fetchMyMumbles';
import { Mumble, QwackerMumbleResponse } from '@/services';

type QwackerMumbleResponseNextURL = { next: string };

const token = 'LPwnxnvQNBkn5DabtZ_env74EPct7UD3IgIXPftR1YoSX6QMfvhOSw819eX6CU5m7SPAAAA';

const mumblesAPIResponse: { data: QwackerMumbleResponse & QwackerMumbleResponseNextURL } = {
  data: {
    count: 2,
    data: [
      {
        id: '01GYSYGSWPV3VRRDGXT49NEM53',
        creator: '201444056083988737',
        text: 'test',
        mediaUrl: null,
        mediaType: null,
        likeCount: 0,
        likedByUser: false,
        type: 'post',
        replyCount: 1,
      },
      {
        id: '01GX6PBM39F3BDX9XXJF8G00XB',
        creator: '201444056083988737',
        text: 'Sunset in Rappi 🌅 #sunset #rappi',
        mediaUrl: 'https://storage.googleapis.com/qwacker-api-prod-data/f007a3fd-5ae0-43ea-bbba-3a8a6525821a',
        mediaType: 'image/jpeg',
        likeCount: 4,
        likedByUser: false,
        type: 'post',
        replyCount: 0,
      },
    ],
    next: '//qwacker-api-http-prod-4cxdci3drq-oa.a.run.app/posts?offset=2&limit=2',
  },
};

const mumblesResult: {
  count: number;
  mumbles: Mumble[];
} = {
  count: 2,
  mumbles: [
    {
      id: '01GYSYGSWPV3VRRDGXT49NEM53',
      creator: '201444056083988737',
      text: 'test',
      mediaUrl: null,
      mediaType: null,
      likeCount: 0,
      likedByUser: false,
      type: 'post',
      replyCount: 1,
      createdTimestamp: 1682350565270,
    },
    {
      id: '01GX6PBM39F3BDX9XXJF8G00XB',
      creator: '201444056083988737',
      text: 'Sunset in Rappi 🌅 #sunset #rappi',
      mediaUrl: 'https://storage.googleapis.com/qwacker-api-prod-data/f007a3fd-5ae0-43ea-bbba-3a8a6525821a',
      mediaType: 'image/jpeg',
      likeCount: 4,
      likedByUser: false,
      type: 'post',
      replyCount: 0,
      createdTimestamp: 1680630730857,
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

      const result = await fetchMyMumbles({ limit: 10, offset: 0, creator: '201444056083988737', token });

      expect(mockAxios.get).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_QWACKER_API_URL}/posts?limit=10&offset=0&creator=201444056083988737`,
        {
          headers: {
            Authorization: 'Bearer LPwnxnvQNBkn5DabtZ_env74EPct7UD3IgIXPftR1YoSX6QMfvhOSw819eX6CU5m7SPAAAA',
            'content-type': 'application/json',
          },
        }
      );
      expect(result).toEqual(mumblesResult);
    });
  });

  describe('when API call fails', () => {
    it('should throw an error when the response is not successful', async () => {
      const errorMessage = "Cannot read properties of null (reading 'data')";
      mockAxios.get.mockResolvedValueOnce(null);

      await expect(fetchMyMumbles({ limit: 10, offset: 0, creator: '201444056083988737', token })).rejects.toThrowError(
        errorMessage
      );
    });

    it('should throw a generic error when an unexpected error occurs', async () => {
      const message = 'Could not fetch mumbles';
      mockAxios.get.mockRejectedValueOnce(new Error(message));

      try {
        await fetchMyMumbles({});
      } catch (e) {
        expect(e).toEqual(new Error(message));
      }

      expect(mockAxios.get).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_QWACKER_API_URL}/posts?limit=1000&offset=0&creator=`,
        {
          headers: {
            Authorization: null,
            'content-type': 'application/json',
          },
        }
      );
    });
  });
});
