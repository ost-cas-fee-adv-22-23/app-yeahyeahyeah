import axios from 'axios';
import { User } from './qwacker';

export const fetchUser = async (params?: { id: string; token: string }) => {
  const { id, token } = params || {};
  const idParams = id ? `${id}` : '';
  const url = `${process.env.NEXT_PUBLIC_QWACKER_API_URL}/users/${idParams}`;

  const { data } = await axios.get(url, {
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return {
    id: data.id,
    userName: data.userName,
    firstName: data.firstName,
    lastName: data.lastName,
    avatarUrl: data.avatarUrl,
  } as User;
};
