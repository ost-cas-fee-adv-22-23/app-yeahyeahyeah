import axios from 'axios';
import { Mumble, transformSingleMumble, QwackerSingleMumbleResponse } from './qwacker';

export const fetchSingleMumble = async (params?: { id: string; token?: string }) => {
  const { id, token } = params || {};

  const url = `${process.env.NEXT_PUBLIC_QWACKER_API_URL}/posts/${id}`;

  const { data } = (await axios.get(url, {
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })) as QwackerSingleMumbleResponse;

  const mumble = transformSingleMumble(data);

  return mumble as Mumble;
};
