/**
 * Generates a random sentence using an array of predefined nouns, verbs, adjectives,
 * adverbs, and prepositions.
 * @returns A randomly generated sentence as a string.
 */
export const generateSentence = (): string => {
  const nouns: string[] = ['bird', 'clock', 'boy', 'plastic', 'duck', 'citizen', 'old lady', 'politician', 'hamster', 'dog'];
  const verbs: string[] = ['kicked', 'ran', 'flew', 'dodged', 'sliced', 'rolled', 'died', 'breathed', 'slept', 'killed'];
  const adjectives: string[] = [
    'beautiful',
    'lazy',
    'professional',
    'lovely',
    'dumb',
    'rough',
    'soft',
    'hot',
    'vibrating',
    'slimy',
  ];
  const adverbs: string[] = [
    'slowly',
    'elegantly',
    'precisely',
    'quickly',
    'sadly',
    'humbly',
    'proudly',
    'shockingly',
    'calmly',
    'passionately',
  ];
  const preposition: string[] = ['down', 'into', 'up', 'on', 'upon', 'below', 'above', 'through', 'across', 'towards'];

  // Generate random values to select a word from each array
  const rand1: number = Math.floor(Math.random() * 10);
  const rand2: number = Math.floor(Math.random() * 10);
  const rand3: number = Math.floor(Math.random() * 10);
  const rand4: number = Math.floor(Math.random() * 10);
  const rand5: number = Math.floor(Math.random() * 10);
  const rand6: number = Math.floor(Math.random() * 10);

  // Combine the randomly selected words to form the sentence
  const content: string = `The ${adjectives[rand1]} ${nouns[rand2]} ${adverbs[rand3]} ${verbs[rand4]} 
  because some ${nouns[rand1]} ${adverbs[rand1]} ${verbs[rand1]} ${preposition[rand1]} a ${adjectives[rand2]} 
  ${nouns[rand5]} which, became a ${adjectives[rand3]}, ${adjectives[rand4]} ${nouns[rand6]}.`;

  return content;
};
