import axios from 'axios';

export const deleteMumble = async (id: string, accessToken?: string) => {
  if (!accessToken) {
    throw new Error('No access token');
  }

  try {
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_QWACKER_API_URL}/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response) {
      throw new Error('Something was not okay');
    }

    return response;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Could not post mumble');
  }
};
