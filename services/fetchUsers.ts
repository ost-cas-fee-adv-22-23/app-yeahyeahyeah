import axios from 'axios';
import { User } from './qwacker';

export const fetchUser = async (params?: {
  id?: string;

  token: string;
}) => {
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
    avatarUrl: data.avatarUrl,
    firstName: data.firstName,
    id: data.id,
    lastName: data.lastName,
    userName: data.userName,
  } as User;
};
