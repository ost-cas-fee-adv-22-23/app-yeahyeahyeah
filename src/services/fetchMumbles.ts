import axios from 'axios';
import { transformMumble, QwackerMumbleResponse, Mumble } from './qwacker';

export const fetchMumbles = async (params?: { limit?: number; offset?: number; newerThanMumbleId?: string }) => {
  const { limit, offset, newerThanMumbleId } = params || {};

  const url = `${process.env.NEXT_PUBLIC_QWACKER_API_URL}/posts?${new URLSearchParams({
    limit: limit?.toString() || '10',
    offset: offset?.toString() || '0',
    newerThan: newerThanMumbleId || '',
  })}`;

  const instance = axios.create();
  instance.interceptors.response.use((response) => {
    const res = response.data.data.filter((mumble: Mumble) => mumble.type === 'post');
    response.data.data = res;

    return response;
  });

  const { data, count } = (
    await instance.get(url, {
      headers: {
        'content-type': 'application/json',
      },
    })
  ).data as QwackerMumbleResponse;

  const mumbles = data.map(transformMumble);

  return {
    count,
    mumbles,
  };
};
