import axios from 'axios';
import { User } from './qwacker';

export const fetchUsers = async (params?: {
  limit?: number;
  offset?: number;
  newerThanMumbleId?: string;
  token: string;
}) => {
  const { limit, offset, newerThanMumbleId, token } = params || {};

  const url = `${process.env.NEXT_PUBLIC_QWACKER_API_URL}/users?${new URLSearchParams({
    limit: limit?.toString() || '10',
    offset: offset?.toString() || '0',
    newerThan: newerThanMumbleId || '',
  })}`;

  const { data } = await axios.get(url, {
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return [
    {
      avatarUrl: data.avatarUrl,
      firstName: data.firstName,
      id: data.id,
      lastName: data.lastName,
      userName: data.userName,
    } as User,
  ];
};
