import axios from 'axios';
import { transformMumble } from './qwacker';
import { UploadImage } from './qwacker';

export const postMumble = async (text: string, file: UploadImage | null, accessToken?: string) => {
  if (!accessToken) {
    throw new Error('No access token');
  }

  const formData = new FormData();
  formData.append('text', text);
  if (file) {
    formData.append('image', file);
  }

  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_QWACKER_API_URL}/posts`, formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response) {
      throw new Error('Something was not okay');
    }

    return transformMumble(await response.data);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Could not post mumble');
  }
};
