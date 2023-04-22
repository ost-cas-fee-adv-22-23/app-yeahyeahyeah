import axios from 'axios';
import { transformMumble, QwackerMumbleResponse } from '../types/qwacker';

export const fetchReplies = async (params: { id?: string; token?: string }) => {
  const { id, token } = params || {};
  const url = `${process.env.NEXT_PUBLIC_QWACKER_API_URL}/posts/${id}/replies`;

  try {
    const { data } = (await axios.get(url, {
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })) as QwackerMumbleResponse;

    if (!data) {
      throw new Error('Something was not okay.');
    }

    const mumbles = data.map(transformMumble);

    return {
      count: mumbles.length,
      mumbles,
    };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Could not fetch replies');
  }
};
