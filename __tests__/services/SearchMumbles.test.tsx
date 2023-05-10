import mockAxios from 'jest-mock-axios';
import { searchMumbles } from '@/services/searchMumbles';
import { Mumble } from '@/services';

type QwackerSearchResponse = { data: { count: number; data: Omit<Mumble, 'createdTimestamp'>[] } };

const mumblesAPIResponse: QwackerSearchResponse = {
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

describe('Test for searchMumbles service', () => {
  afterEach(() => {
    mockAxios.reset();
  });

  describe('when API call is successful', () => {
    it('should return a list with posts that include a hashtag', async () => {
      mockAxios.post.mockResolvedValueOnce(mumblesAPIResponse);

      const result = await searchMumbles({ limit: 2, offset: 0, token: 'token', text: '#' });

      expect(mockAxios.post).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_QWACKER_API_URL}/posts/search`,
        { limit: 2, offset: 0, tags: undefined, text: '#' },
        { headers: { Authorization: 'Bearer token', 'content-type': 'application/json' } }
      );

      expect(result).toEqual(mumblesResult);
    });
  });

  describe('when API call fails', () => {
    it('should return empty mumbles list', async () => {
      const message = 'Could not fetch mumbles';
      mockAxios.post.mockRejectedValueOnce(new Error(message));

      try {
        await searchMumbles({ limit: 2, offset: 0, token: 'token', text: '#' });
      } catch (e) {
        expect(e).toEqual(new Error(message));
      }

      expect(mockAxios.post).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_QWACKER_API_URL}/posts/search`,
        { limit: 2, offset: 0, tags: undefined, text: '#' },
        { headers: { Authorization: 'Bearer token', 'content-type': 'application/json' } }
      );
    });
  });
});
