export const generateRandom = (min: number = 0, max: number = 100): number => {
  const difference: number = max - min;
  let rand: number = Math.random();
  rand = Math.floor(rand * difference);
  rand = rand + min;
  return rand;
};
