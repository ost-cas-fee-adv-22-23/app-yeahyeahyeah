/**
 * Generates a hashtag string with the current date and the text "e2e-3yeah".
 * @returns {string} The hashtag string.
 */
export const generateHashtag = (): string => {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const seconds = date.getSeconds();
  const hashtag = `e2e3yeah${day}${month}${year}${seconds}`;

  return hashtag;
};
