import mockAxios from 'jest-mock-axios';
import { fetchReplies } from '@/services/fetchReplies';
import { QwackerReplyResponse, RawReply } from '@/services';

const id = '01H1BP6RYRRGFY4WPGVB14AKMH';
const token = 'LPwnxnvQNBkn5DabtZ_env74EPct7UD3IgIXPftR1YoSX6QMfvhOSw819eX6CU5m7SPAAAA';

const repliesAPIResponse: { data: RawReply[] } = {
  data: [
    {
      id: '01GZ52SS8EZNEZ7J52GGP505V2',
      creator: '201444056083988737',
      text: 'Spaghetti Code ',
      mediaUrl: 'https://storage.googleapis.com/qwacker-api-prod-data/3960123a-c4a5-41c5-9b7c-7b23a1c0c7fc',
      mediaType: 'image/jpeg',
      likeCount: 0,
      likedByUser: false,
      type: 'reply',
      parentId: '01GZ427TP4JFBFN8EZHWZH14V4',
    },
    {
      id: '01GZ5217T85S6N8R05YZKP8H72',
      creator: '201444056083988737',
      text: '#cleancodeisnice :-D',
      mediaUrl: null,
      mediaType: null,
      likeCount: 0,
      likedByUser: false,
      type: 'reply',
      parentId: '01GZ427TP4JFBFN8EZHWZH14V4',
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
    },
  ],
};

const repliesResult: QwackerReplyResponse = {
  count: 3,
  mumbles: [
    {
      id: '01GZ52SS8EZNEZ7J52GGP505V2',
      creator: '201444056083988737',
      text: 'Spaghetti Code ',
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
      text: '#cleancodeisnice :-D',
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

describe('Tests for fetchReplies fetcher', () => {
  describe('when API call is successful', () => {
    it('should return a list of replies', async () => {
      mockAxios.get.mockResolvedValueOnce(repliesAPIResponse);

      const result = await fetchReplies({ id, token });

      expect(mockAxios.get).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_QWACKER_API_URL}/posts/01H1BP6RYRRGFY4WPGVB14AKMH/replies`,
        {
          headers: {
            Authorization: 'Bearer LPwnxnvQNBkn5DabtZ_env74EPct7UD3IgIXPftR1YoSX6QMfvhOSw819eX6CU5m7SPAAAA',
            'content-type': 'application/json',
          },
        }
      );
      expect(result).toEqual(repliesResult);
    });
  });

  describe('when API call fails', () => {
    it('should throw an error when the response is not successful', async () => {
      const errorMessage = "Cannot destructure property 'data' of '(intermediate value)' as it is null.";
      mockAxios.get.mockResolvedValueOnce(null);

      await expect(fetchReplies({ id, token })).rejects.toThrowError(errorMessage);
    });

    it('should throw a generic error when an unexpected error occurs', async () => {
      const message = 'Could not fetch mumbles';
      mockAxios.get.mockRejectedValueOnce(new Error(message));

      try {
        await fetchReplies({ id, token });
      } catch (e) {
        expect(e).toEqual(new Error(message));
      }

      expect(mockAxios.get).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_QWACKER_API_URL}/posts/01H1BP6RYRRGFY4WPGVB14AKMH/replies`,
        {
          headers: {
            Authorization: 'Bearer LPwnxnvQNBkn5DabtZ_env74EPct7UD3IgIXPftR1YoSX6QMfvhOSw819eX6CU5m7SPAAAA',
            'content-type': 'application/json',
          },
        }
      );
    });
  });
});
