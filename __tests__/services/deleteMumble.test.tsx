import axios from 'axios';
import { deleteMumble } from '@/services/deleteMumble';
import mockAxios from 'jest-mock-axios';

const id = '01H1BP6RYRRGFY4WPGVB14AKMH';
const accessToken = 'LPwnxnvQNBkn5DabtZ_env74EPct7UD3IgIXPftR1YoSX6QMfvhOSw819eX6CU5m7SPAAAA';

const mockResponse = {
  data: '',
  status: 204,
  statusText: '',
  headers: {
    'content-length': '0',
    'content-type': 'text/html',
  },
  config: {
    headers: {
      Accept: 'application/json, text/plain, */*',
      Authorization: 'Bearer LPwnxnvQNBkn5DabtZ_env74EPct7UD3IgIXPftR1YoSX6QMfvhOSw819eX6CU5m7SPAAAA',
    },
    method: 'delete',
    url: 'https://qwacker-api-http-prod-4cxdci3drq-oa.a.run.app/posts/01H1BPDJX7V37DW6FK40H43E09',
  },
};

describe('Tests for deleteMumble fetcher', () => {
  describe('when API call is successful', () => {
    it('should delete a mumble successfully', async () => {
      mockAxios.delete.mockResolvedValueOnce(mockResponse);

      const response = await deleteMumble(id, accessToken);

      expect(axios.delete).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_QWACKER_API_URL}/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      expect(response).toEqual(mockResponse);
    });
  });

  describe('when API call fails', () => {
    it('should throw an error when the response is not successful', async () => {
      const errorMessage = 'Something was not okay';
      mockAxios.delete.mockResolvedValueOnce(null);

      await expect(deleteMumble(id, accessToken)).rejects.toThrowError(errorMessage);
    });

    it('should throw a generic error when an unexpected error occurs', async () => {
      const errorMessage = 'Could not post mumble at this time. Please try again later.';
      mockAxios.delete.mockResolvedValueOnce(new Error(errorMessage));

      try {
        await deleteMumble(id, accessToken);
      } catch (e) {
        expect(e).toEqual(new Error(errorMessage));
      }
    });
  });
});
