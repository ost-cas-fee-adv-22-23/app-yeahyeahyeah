import axios from 'axios';
import { transformMumble, QwackerMumbleResponse } from './qwacker';

export const fetchMumbles = async (params?: {
  limit?: number;
  offset?: number;
  newerThanMumbleId?: string;
  token?: string;
}) => {
  const { limit, offset, newerThanMumbleId, token } = params || {};

  const url = `${process.env.NEXT_PUBLIC_QWACKER_API_URL}/posts?${new URLSearchParams({
    limit: limit?.toString() || '10',
    offset: offset?.toString() || '0',
    newerThan: newerThanMumbleId || '',
  })}`;

  try {
    const { data, count } = (
      await axios.get(url, {
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
    ).data as QwackerMumbleResponse;

    const mumbles = data.map(transformMumble);

    if (!data) {
      throw new Error('Something was not okay.');
    }

    return {
      count,
      mumbles,
    };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Could not fetch mumbles');
  }
};
