import axios from 'axios';
import { transformMumble, QwackerMumbleResponse } from '../types/qwacker';

export const fetchMumbles = async (params: {
  limit?: number;
  offset?: number;
  newerThanMumbleId?: string;
  token?: string;
}) => {
  const { limit, offset, newerThanMumbleId, token } = params || {};

  const searchParams = new URLSearchParams({
    limit: limit?.toString() || '10',
    offset: offset?.toString() || '0',
  });

  if (newerThanMumbleId) searchParams.append('newerThan', newerThanMumbleId);

  const url = `${process.env.NEXT_PUBLIC_QWACKER_API_URL}/posts?${searchParams}`;

  try {
    const { data, count } = (
      await axios.get(url, {
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
