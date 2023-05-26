import mockAxios from 'jest-mock-axios';
import { fetchUser } from '@/services/fetchUser';
import { User } from '@/services';

const id = '201161463811801345';
const token = 'LPwnxnvQNBkn5DabtZ_env74EPct7UD3IgIXPftR1YoSX6QMfvhOSw819eX6CU5m7SPAAAA';

const mumbleAPIResponse: { data: User } = {
  data: {
    id: '201161463811801345',
    userName: 'Filiks',
    firstName: 'Felix',
    lastName: 'Adamsky',
    avatarUrl:
      'https://cas-fee-advanced-ocvdad.zitadel.cloud/assets/v1/179828644300980481/users/201161463811801345/avatar?v=59b9ea90385ad5b69bb7401bfcac3634',
  },
};

const mumbleResult: User = {
  id: '201161463811801345',
  userName: 'Filiks',
  firstName: 'Felix',
  lastName: 'Adamsky',
  avatarUrl:
    'https://cas-fee-advanced-ocvdad.zitadel.cloud/assets/v1/179828644300980481/users/201161463811801345/avatar?v=59b9ea90385ad5b69bb7401bfcac3634',
};

describe('Tests for fetchUser fetcher', () => {
  afterEach(() => {
    mockAxios.reset();
  });

  describe('when API call is successful', () => {
    it('should return a single user', async () => {
      mockAxios.get.mockResolvedValueOnce(mumbleAPIResponse);

      const result = await fetchUser({ id, token });

      expect(mockAxios.get).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_QWACKER_API_URL}/users/201161463811801345`, {
        headers: { Authorization: `Bearer ${token}`, 'content-type': 'application/json' },
      });
      expect(result).toEqual(mumbleResult);
    });
  });

  describe('when API call fails', () => {
    it('should throw an error when the response is not successful', async () => {
      mockAxios.get.mockResolvedValueOnce(null);
      await expect(fetchUser({ id, token })).rejects.toThrowError(/Cannot destructure property 'data'/);

      mockAxios.get.mockResolvedValueOnce(null);
      await expect(fetchUser({ id, token })).rejects.toThrowError(/as it is null./);
    });

    it('should throw a generic error when an unexpected error occurs', async () => {
      const message = 'Could not fetch single user';
      mockAxios.get.mockRejectedValueOnce(new Error(message));

      try {
        await fetchUser({ id, token });
      } catch (e) {
        expect(e).toEqual(new Error(message));
      }

      expect(mockAxios.get).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_QWACKER_API_URL}/users/201161463811801345`, {
        headers: { Authorization: `Bearer ${token}`, 'content-type': 'application/json' },
      });
    });
  });
});
