/**
 * Generates a hashtag string with the current date and the text "e2e-3yeah".
 * @returns {string} The hashtag string.
 */
export const generateHashtag = (date = new Date()): string =>
  `e2e3yeah${date.getDate()}${date.getMonth() + 1}${date.getFullYear()}`;
