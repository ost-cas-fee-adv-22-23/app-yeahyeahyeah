import mockAxios from 'jest-mock-axios';
import { postReply } from '@/services/postReply';
import { Mumble, UploadImage } from '@/services';

type QwackerPostResponse = { data: Omit<Mumble, 'createdTimestamp'> };

const id = '01H1E7CYZ9YDY7Y9T9GXPD641H';
const text = 'Cats everywhere.';
const accessToken = 'LPwnxnvQNBkn5DabtZ_env74EPct7UD3IgIXPftR1YoSX6QMfvhOSw819eX6CU5m7SPAAAA';

const file: UploadImage = {
  ...new File([''], 'funnycat.gif', {
    type: 'image/gif',
  }),
  preview: 'blob:http://localhost:3000/fdf3acb5-94a4-4ad5-bb8f-195d077b3442',
} as UploadImage;

const formData = new FormData();
formData.append('text', text);
formData.append('image', file);

const mumbleAPIResponse: QwackerPostResponse = {
  data: {
    id: '01H1E7RZQJS2BWPK6C5MYCN09K',
    creator: '201444056083988737',
    text: 'Cats everywhere',
    mediaUrl: 'https://storage.googleapis.com/qwacker-api-prod-data/17d23319-442b-41bc-bc36-527c7d281669',
    mediaType: 'image/gif',
    likeCount: 0,
    likedByUser: false,
    type: 'reply',
    parentId: '01H1E7CYZ9YDY7Y9T9GXPD641H',
  },
};

const mumbleResult: Mumble = {
  id: '01H1E7RZQJS2BWPK6C5MYCN09K',
  creator: '201444056083988737',
  text: 'Cats everywhere',
  mediaUrl: 'https://storage.googleapis.com/qwacker-api-prod-data/17d23319-442b-41bc-bc36-527c7d281669',
  mediaType: 'image/gif',
  likeCount: 0,
  likedByUser: false,
  type: 'reply',
  parentId: '01H1E7CYZ9YDY7Y9T9GXPD641H',
  createdTimestamp: 1685178842866,
};

describe('Tests for postReply fetcher', () => {
  afterEach(() => {
    mockAxios.reset();
  });

  describe('when API call is successful', () => {
    it('should return a reply that has been posted', async () => {
      mockAxios.post.mockResolvedValueOnce(mumbleAPIResponse);

      const result = await postReply(id, text, file, accessToken);

      expect(mockAxios.post).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_QWACKER_API_URL}/posts/${id}`, formData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      expect(result).toEqual(mumbleResult);
    });
  });

  describe('when API call fails', () => {
    it('should throw an error when the response is not successful', async () => {
      mockAxios.post.mockResolvedValueOnce(null);

      await expect(postReply(id, text, file, accessToken)).rejects.toThrow('Something was not okay');
    });

    it('should throw a generic error when an unexpected error occurs', async () => {
      const message = 'Could not post reply';
      mockAxios.post.mockRejectedValueOnce(new Error(message));

      try {
        await postReply(id, text, file, accessToken);
      } catch (e) {
        expect(e).toEqual(new Error(message));
      }

      expect(mockAxios.post).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_QWACKER_API_URL}/posts/${id}`, formData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    });
  });
});
