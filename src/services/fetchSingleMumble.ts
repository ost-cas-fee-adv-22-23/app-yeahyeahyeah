import axios from 'axios';
import { Mumble, transformSingleMumble, QwackerSingleMumbleResponse } from '../types/qwacker';

export const fetchSingleMumble = async (params: { id: string; token?: string }) => {
  const { id, token } = params || {};

  const url = `${process.env.NEXT_PUBLIC_QWACKER_API_URL}/posts/${id}`;

  try {
    const { data } = (await axios.get(url, {
      headers: {
        'content-type': 'application/json',
        Authorization: token ? `Bearer ${token}` : null,
      },
    })) as QwackerSingleMumbleResponse;

    if (!data) {
      throw new Error('Something was not okay.');
    }

    const mumble = transformSingleMumble(data);

    return mumble as Mumble;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Could not fetch single mumble');
  }
};
