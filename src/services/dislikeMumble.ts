import axios from 'axios';

export const dislikeMumble = async (params?: { id: string; token: string }) => {
  const { id, token } = params || {};
  const idParams = id ? `${id}` : '';
  const url = `${process.env.NEXT_PUBLIC_QWACKER_API_URL}posts/${idParams}/likes`;

  await axios
    .delete(url, {
      headers: {
        'content-type': '*/*',
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => console.log('Dislike mumble success', response.status))
    .catch((error) => {
      console.error('There was an error!', error);
    });
};
