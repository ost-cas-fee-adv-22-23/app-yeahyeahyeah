import axios from 'axios';
import { User } from '../types/qwacker';

export const fetchUsers = async (params?: { limit?: number; offset?: number; token: string }) => {
  const { limit, offset, token } = params || {};

  const url = `${process.env.NEXT_PUBLIC_QWACKER_API_URL}/users?${new URLSearchParams({
    limit: limit?.toString() || '10',
    offset: offset?.toString() || '0',
  })}`;

  try {
    const { data } = await axios.get(url, {
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!data) {
      throw new Error('Something was not okay fetching users.');
    }

    return data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Could not fetch users');
  }
};
