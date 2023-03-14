import axios from 'axios';
import { transformMumble, QwackerMumbleResponse, Mumble } from './qwacker';

/*
  example: https://qwacker-api-http-prod-4cxdci3drq-oa.a.run.app/posts?offset=0&limit=100&creator=201161756305785089
 */

export const fetchMumblesByCreator = async (params?: {
  limit?: number;
  offset?: number;
  creator?: number;
  token?: string;
}) => {
  const { limit, offset, creator, token } = params || {};

  const url = `${process.env.NEXT_PUBLIC_QWACKER_API_URL}/posts?${new URLSearchParams({
    limit: limit?.toString() || '10',
    offset: offset?.toString() || '0',
    creator: creator?.toString() || '',
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
        Authorization: `Bearer ${token}`,
      },
    })
  ).data as QwackerMumbleResponse;

  const mumbles = data.map(transformMumble);

  return {
    count,
    mumbles,
  };
};
