export const generateUniqueElements = (elementsNumber: number, min: number, max: number): number[] => {
  if (elementsNumber < 1 || max - min + 1 < elementsNumber) {
    throw new Error("No se pueden generar números únicos con los parámetros proporcionados.");
  }

  const generatedNumbers: number[] = [];

  while (generatedNumbers.length < elementsNumber) {
    const randomNumber: number = Math.floor(Math.random() * (max - min + 1)) + min;

    if (!generatedNumbers.includes(randomNumber)) {
      generatedNumbers.push(randomNumber);
    }
  }

  return generatedNumbers;
}
