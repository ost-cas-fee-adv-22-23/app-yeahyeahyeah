import axios from 'axios';

export const deleteMumble = async (id: string, accessToken?: string) => {
  try {
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_QWACKER_API_URL}/posts/${id}`, {
      headers: {
        Authorization: accessToken ? `Bearer ${accessToken}` : null,
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
