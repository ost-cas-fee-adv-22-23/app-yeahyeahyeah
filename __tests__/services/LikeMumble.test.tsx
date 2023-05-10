import mockAxios from 'jest-mock-axios';
import { likeMumble } from '@/services/likeMumble';

describe('Test for likeMumble service', () => {
  afterEach(() => {
    mockAxios.reset();
  });

  describe('when API call is successful', () => {
    it('should return 200 if mumble like is successfull', async () => {
      mockAxios.put.mockResolvedValueOnce({});

      const result = await likeMumble({ id: '01GZJVVFGNKBNGJQ0HHAE7B3Q9', token: 'token' });

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

  describe('when API call fails', () => {
    it('should return 400 if mumble like is successfull', async () => {
      const message = 'Unauthorized';
      mockAxios.put.mockRejectedValueOnce(new Error(message));

      try {
        await likeMumble({ id: '01GZJVVFGNKBNGJQ0HHAE7B3Q9', token: 'token' });
      } catch (e) {
        expect(e).toEqual(new Error(message));
      }

      expect(mockAxios.put).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_QWACKER_API_URL}/posts/01GZJVVFGNKBNGJQ0HHAE7B3Q9/likes`,
        {},
        {
          headers: { Authorization: 'Bearer token', 'content-type': '*/*' },
        }
      );
    });
  });
});
