import mockAxios from 'jest-mock-axios';
import { fetchSingleMumble } from '@/services/fetchSingleMumble';
import { Mumble, QwackerSingleMumbleResponse } from '@/services';

const id = '01H1CRQRK9PH6DGDA8DG8PEGJC';
const token = 'LPwnxnvQNBkn5DabtZ_env74EPct7UD3IgIXPftR1YoSX6QMfvhOSw819eX6CU5m7SPAAAA';

const mumbleAPIResponse: QwackerSingleMumbleResponse = {
  data: {
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
};

const mumbleResult: Mumble = {
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
};

describe('Tests for fetchMumbles fetcher', () => {
  afterEach(() => {
    mockAxios.reset();
  });

  describe('when API call is successful', () => {
    it('should return a single mumble', async () => {
      mockAxios.get.mockResolvedValueOnce(mumbleAPIResponse);

      const result = await fetchSingleMumble({ id, token });

      expect(mockAxios.get).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_QWACKER_API_URL}/posts/01H1CRQRK9PH6DGDA8DG8PEGJC`,
        {
          headers: { Authorization: `Bearer ${token}`, 'content-type': 'application/json' },
        }
      );
      expect(result).toEqual(mumbleResult);
    });
  });

  describe('when API call fails', () => {
    it('should throw an error when the response is not successful', async () => {
      mockAxios.get.mockResolvedValueOnce(null);
      await expect(fetchSingleMumble({ id, token })).rejects.toThrowError(/Cannot destructure property 'data'/);

      mockAxios.get.mockResolvedValueOnce(null);
      await expect(fetchSingleMumble({ id, token })).rejects.toThrowError(/as it is null./);
    });

    it('should throw a generic error when an unexpected error occurs', async () => {
      const message = 'Could not fetch single mumble';
      mockAxios.get.mockRejectedValueOnce(new Error(message));

      try {
        await fetchSingleMumble({ id });
      } catch (e) {
        expect(e).toEqual(new Error(message));
      }

      expect(mockAxios.get).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_QWACKER_API_URL}/posts/01H1CRQRK9PH6DGDA8DG8PEGJC`,
        {
          headers: { Authorization: null, 'content-type': 'application/json' },
        }
      );
    });
  });
});
