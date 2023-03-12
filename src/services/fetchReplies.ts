import axios from 'axios';
import { transformMumble, QwackerMumbleResponse, Mumble } from './qwacker';

export const fetchReplies = async (params?: { id: string }) => {
  const { id } = params || {};
  const url = `${process.env.NEXT_PUBLIC_QWACKER_API_URL}/posts/${id}/replies`;

  const instance = axios.create();
  instance.interceptors.response.use((response) => {
    const res = response.data.filter((mumble: Mumble) => mumble.type === 'reply');
    response.data = res;

    return response;
  });

  const { data } = (await instance.get(url, {
    headers: {
      'content-type': 'application/json',
    },
  })) as QwackerMumbleResponse;

  const replies = data.map(transformMumble);

  return {
    count: replies.length,
    replies,
  };
};
