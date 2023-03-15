import axios from 'axios';
import { transformMumble, QwackerMumbleResponse, Mumble } from './qwacker';

export const fetchReplies = async (params?: { id: string; token?: string }) => {
  const { id, token } = params || {};
  const url = `${process.env.NEXT_PUBLIC_QWACKER_API_URL}/posts/${id}/replies`;

  const { data } = (await axios.get(url, {
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })) as QwackerMumbleResponse;

  const replies = data.map(transformMumble);

  return {
    count: replies.length,
    replies,
  };
};
