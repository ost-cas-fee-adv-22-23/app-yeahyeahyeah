import axios from 'axios';
import { User } from '../types/qwacker';

export const fetchUser = async (params: { id: string; token: string }) => {
  const { id, token } = params || {};
  const idParams = id ? `${id}` : '';
  const url = `${process.env.NEXT_PUBLIC_QWACKER_API_URL}/users/${idParams}`;

  try {
    const { data } = await axios.get(url, {
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!data) {
      throw new Error('Something was not okay fetching a user.');
    }

    return {
      id: data.id,
      userName: data.userName,
      firstName: data.firstName,
      lastName: data.lastName,
      avatarUrl: data.avatarUrl,
    } as User;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Could not fetch user');
  }
};
