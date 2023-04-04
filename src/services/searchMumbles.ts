import axios from 'axios';
import { transformMumble, QwackerMumbleResponse } from '../types/qwacker';

export const searchMumbles = async (params?: {
  limit?: number;
  offset?: number;
  isReply?: boolean;
  tags?: string[];
  text?: string;
  token: string;
}) => {
  const { limit, offset, tags, text, token } = params || {};

  const url = `${process.env.NEXT_PUBLIC_QWACKER_API_URL}/posts/search`;

  const formData = {
    text,
    tags,
    offset,
    limit,
  };

  try {
    const { data, count } = (
      await axios.post(url, formData, {
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
    throw new Error(error instanceof Error ? error.message : 'Could not fetch mumbles');
  }
};
