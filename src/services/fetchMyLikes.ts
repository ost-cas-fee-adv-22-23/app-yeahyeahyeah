import axios from 'axios';
import { transformMumble, QwackerMumbleResponse, Mumble } from '../types/qwacker';

export const fetchMyLikes = async (params: { limit?: number; offset?: number; token?: string }) => {
  const { limit, offset, token } = params || {};

  const url = `${process.env.NEXT_PUBLIC_QWACKER_API_URL}/posts?${new URLSearchParams({
    limit: limit?.toString() || '1000',
    offset: offset?.toString() || '0',
  })}`;

  const instance = axios.create();
  instance.interceptors.response.use((response) => {
    const res = response.data.data.filter((mumble: Mumble) => mumble.likedByUser === true);
    response.data.data = res;

    return response;
  });

  try {
    const { data, count } = (
      await instance.get(url, {
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
    ).data as QwackerMumbleResponse;

    if (!data) {
      throw new Error('Something was not okay.');
    }

    const mumbles = data.map(transformMumble);

    return {
      count,
      mumbles,
    };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Could not fetch my likes');
  }
};
