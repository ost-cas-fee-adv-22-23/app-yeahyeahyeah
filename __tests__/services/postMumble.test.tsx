import mockAxios from 'jest-mock-axios';
import { postMumble } from '@/services/postMumble';
import { Mumble, UploadImage } from '@/services';

type QwackerPostResponse = { data: Omit<Mumble, 'createdTimestamp'> };

const text = 'Wenn fliegen hinter Fliegen fliegen, fliegen Fliegen Fliegen nach.';
const accessToken = 'LPwnxnvQNBkn5DabtZ_env74EPct7UD3IgIXPftR1YoSX6QMfvhOSw819eX6CU5m7SPAAAA';

const file: UploadImage = {
  ...new File([''], 'flyonthewall.gif', {
    type: 'image/gif',
  }),
  preview: 'blob:http://localhost:3000/fdf3acb5-94a4-4ad5-bb8f-195d077b3442',
} as UploadImage;

const formData = new FormData();
formData.append('text', text);
formData.append('image', file);

const mumbleAPIResponse: QwackerPostResponse = {
  data: {
    id: '01H1E44B6VQYW74SH74FS6C3ZE',
    creator: '201444056083988737',
    text,
    mediaUrl: 'https://storage.googleapis.com/qwacker-api-prod-data/1653e376-a70a-434d-b2dc-d75b10db51dc',
    mediaType: 'image/gif',
    likeCount: 0,
    likedByUser: false,
    type: 'post',
    replyCount: 0,
  },
};

const mumbleResult: Mumble = {
  id: '01H1E44B6VQYW74SH74FS6C3ZE',
  creator: '201444056083988737',
  text,
  mediaUrl: 'https://storage.googleapis.com/qwacker-api-prod-data/1653e376-a70a-434d-b2dc-d75b10db51dc',
  mediaType: 'image/gif',
  likeCount: 0,
  likedByUser: false,
  type: 'post',
  replyCount: 0,
  createdTimestamp: 1685175020763,
};

describe('Tests for postMumble fetcher', () => {
  afterEach(() => {
    mockAxios.reset();
  });

  describe('when API call is successful', () => {
    it('should return a mumble that has been posted', async () => {
      mockAxios.post.mockResolvedValueOnce(mumbleAPIResponse);

      const result = await postMumble(text, file, accessToken);

      expect(mockAxios.post).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_QWACKER_API_URL}/posts`, formData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      expect(result).toEqual(mumbleResult);
    });
  });

  describe('when API call fails', () => {
    it('should throw an error when the response is not successful', async () => {
      mockAxios.post.mockResolvedValueOnce(null);

      await expect(postMumble(text, file, accessToken)).rejects.toThrow('Something was not okay');
    });

    it('should throw a generic error when an unexpected error occurs', async () => {
      const message = 'Could not post mumble';
      mockAxios.post.mockRejectedValueOnce(new Error(message));

      try {
        await postMumble(text, file, accessToken);
      } catch (e) {
        expect(e).toEqual(new Error(message));
      }

      expect(mockAxios.post).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_QWACKER_API_URL}/posts`, formData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    });
  });
});
