import axios from 'axios';
import { transformMumble, QwackerMumbleResponse, Mumble } from './qwacker';

export const fetchReplies = async (params?: { id: string }) => {
  const { id } = params || {};
  const url = `${process.env.NEXT_PUBLIC_QWACKER_API_URL}/posts/${id}/replies`;

  const { data } = (await axios.get(url, {
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
