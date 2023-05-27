import mockAxios from 'jest-mock-axios';
import { fetchUsers } from '@/services/fetchUsers';
import { User } from '@/services';

const token = 'LPwnxnvQNBkn5DabtZ_env74EPct7UD3IgIXPftR1YoSX6QMfvhOSw819eX6CU5m7SPAAAA';

export const mumbleAPIResponse: { count: number; data: User[] } = {
  count: 5,
  data: [
    {
      id: '179828644301046017',
      userName: 'christoph',
      firstName: 'Christoph',
      lastName: 'Bühler',
      avatarUrl:
        'https://cas-fee-advanced-ocvdad.zitadel.cloud/assets/v1/179828644300980481/users/179828644301046017/avatar?v=fbad86703d114f72f7c57c25fa8ade0a',
    },
    {
      id: '195305735549092097',
      userName: 'peter',
      firstName: 'Peter!',
      lastName: 'Manser',
      avatarUrl:
        'https://cas-fee-advanced-ocvdad.zitadel.cloud/assets/v1/179828644300980481/users/195305735549092097/avatar?v=3b1662b598359b0221e987ebc08375f7',
    },
    {
      id: '201161756305785089',
      userName: 'roli',
      firstName: 'Roland',
      lastName: 'von Aesch',
      avatarUrl:
        'https://cas-fee-advanced-ocvdad.zitadel.cloud/assets/v1/179828644300980481/users/201161756305785089/avatar?v=8872df0d1e075a3e2097b367080b8b19',
    },
    {
      id: '201444056083988737',
      userName: 'tomschall',
      firstName: 'Thomas',
      lastName: 'Schallert',
      avatarUrl:
        'https://cas-fee-advanced-ocvdad.zitadel.cloud/assets/v1/179828644300980481/users/201444056083988737/avatar?v=ac6cfc0064df0865522b5df8bf6b84c6',
    },
    {
      id: '207491759419162881',
      userName: 'yeahyeahyeah',
      firstName: 'Yeah',
      lastName: 'Yeahyeah',
      avatarUrl: '',
    },
  ],
};

const mumbleResult: User[] = [
  {
    id: '179828644301046017',
    userName: 'christoph',
    firstName: 'Christoph',
    lastName: 'Bühler',
    avatarUrl:
      'https://cas-fee-advanced-ocvdad.zitadel.cloud/assets/v1/179828644300980481/users/179828644301046017/avatar?v=fbad86703d114f72f7c57c25fa8ade0a',
  },
  {
    id: '195305735549092097',
    userName: 'peter',
    firstName: 'Peter!',
    lastName: 'Manser',
    avatarUrl:
      'https://cas-fee-advanced-ocvdad.zitadel.cloud/assets/v1/179828644300980481/users/195305735549092097/avatar?v=3b1662b598359b0221e987ebc08375f7',
  },
  {
    id: '201161756305785089',
    userName: 'roli',
    firstName: 'Roland',
    lastName: 'von Aesch',
    avatarUrl:
      'https://cas-fee-advanced-ocvdad.zitadel.cloud/assets/v1/179828644300980481/users/201161756305785089/avatar?v=8872df0d1e075a3e2097b367080b8b19',
  },
  {
    id: '201444056083988737',
    userName: 'tomschall',
    firstName: 'Thomas',
    lastName: 'Schallert',
    avatarUrl:
      'https://cas-fee-advanced-ocvdad.zitadel.cloud/assets/v1/179828644300980481/users/201444056083988737/avatar?v=ac6cfc0064df0865522b5df8bf6b84c6',
  },
  {
    id: '207491759419162881',
    userName: 'yeahyeahyeah',
    firstName: 'Yeah',
    lastName: 'Yeahyeah',
    avatarUrl: '',
  },
];

describe('Tests for fetchUsers fetcher', () => {
  afterEach(() => {
    mockAxios.reset();
  });

  describe('when API call is successful', () => {
    it('should return a list of users', async () => {
      mockAxios.get.mockResolvedValueOnce(mumbleAPIResponse);

      const result = await fetchUsers({ limit: 10, offset: 0, token });

      expect(mockAxios.get).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_QWACKER_API_URL}/users?limit=10&offset=0`, {
        headers: { Authorization: `Bearer ${token}`, 'content-type': 'application/json' },
      });
      expect(result).toEqual(mumbleResult);
    });
  });

  describe('when API call fails', () => {
    it('should throw an error when the response is not successful', async () => {
      mockAxios.get.mockResolvedValueOnce(null);
      await expect(fetchUsers({ limit: 10, offset: 0, token })).rejects.toThrowError(/Cannot destructure property 'data'/);

      mockAxios.get.mockResolvedValueOnce(null);
      await expect(fetchUsers({ limit: 10, offset: 0, token })).rejects.toThrowError(/as it is null./);
    });

    it('should throw a generic error when an unexpected error occurs', async () => {
      const message = 'Could not fetch users';
      mockAxios.get.mockRejectedValueOnce(new Error(message));

      try {
        await fetchUsers({ limit: 10, offset: 0, token });
      } catch (e) {
        expect(e).toEqual(new Error(message));
      }

      expect(mockAxios.get).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_QWACKER_API_URL}/users?limit=10&offset=0`, {
        headers: { Authorization: `Bearer ${token}`, 'content-type': 'application/json' },
      });
    });
  });
});
