export const generatePrice = (voteAverage) => {
  if (voteAverage >= 8) return 20;
  if (voteAverage >= 6) return 15;
  if (voteAverage >= 3) return 10;
  return 5;
};
