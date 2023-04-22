import axios from 'axios';

export const likeMumble = async (params: { id: string; token: string }) => {
  const { id, token } = params || {};
  const idParams = id ? `${id}` : '';
  const url = `${process.env.NEXT_PUBLIC_QWACKER_API_URL}/posts/${idParams}/likes`;

  try {
    const response = await axios.put(
      url,
      {},
      {
        headers: {
          'content-type': '*/*',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response) {
      throw new Error('Something was not okay.');
    }

    return response;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Could not like mumble');
  }
};
