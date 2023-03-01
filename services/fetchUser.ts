import { transformMumble, QwackerMumbleResponse } from './qwacker';

export const fetchUsers = async (params?: { limit?: number; offset?: number; newerThanMumbleId?: string }) => {
  const { limit, offset, newerThanMumbleId } = params || {};

  const url = `${process.env.NEXT_PUBLIC_QWACKER_API_URL}/users?${new URLSearchParams({
    limit: limit?.toString() || '10',
    offset: offset?.toString() || '0',
    newerThan: newerThanMumbleId || '',
  })}`;

  const res = await fetch(url, {
    headers: {
      'content-type': 'application/json',
    },
  });

  const { data } = (await res.json()) as QwackerMumbleResponse;

  const users = data.map(transformMumble);

  return {
    users,
  };
};
