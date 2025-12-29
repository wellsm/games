import { uuidv7 } from "uuidv7";

export const createIdentifier = (): string => {
  return uuidv7();
};

export const createRandomAlphanumeric = (size = 6): string => {
  let result = "";

  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  for (let i = 0; i < size; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
};
