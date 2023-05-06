import mockAxios from 'jest-mock-axios';
import { likeMumble } from '@/services/likeMumble';

describe('fetchMumbles', () => {
  afterEach(() => {
    mockAxios.reset();
  });

  describe('when API call is successful', () => {
    it('should return 200 if mumble like is successfull', async () => {
      mockAxios.put.mockResolvedValueOnce({});

      const result = await likeMumble({ id: '01GZJVVFGNKBNGJQ0HHAE7B3Q9', token: 'token' });

      console.log('result', result);

      expect(mockAxios.put).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_QWACKER_API_URL}/posts/01GZJVVFGNKBNGJQ0HHAE7B3Q9/likes`,
        {},
        {
          headers: { Authorization: 'Bearer token', 'content-type': '*/*' },
        }
      );

      expect(result).toEqual({});
    });
  });

  // describe('when API call fails', () => {
  //   it('should return empty users list', async () => {
  //     const message = 'Could not fetch mumbles';
  //     mockAxios.get.mockRejectedValueOnce(new Error(message));

  //     try {
  //       await fetchMumbles({});
  //     } catch (e) {
  //       expect(e).toEqual(new Error(message));
  //     }

  //     expect(mockAxios.get).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_QWACKER_API_URL}/posts?limit=10&offset=0`, {
  //       headers: { Authorization: null, 'content-type': 'application/json' },
  //     });
  //   });
  // });
});
