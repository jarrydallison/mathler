import { match } from "ts-pattern";

export const operators = ["+", "-", "*", "/"] as const;

export type Operator = (typeof operators)[number];

export const getRandomOperator = () =>
  operators[Math.floor(Math.random() * operators.length)];

export const getRandomNumberLengthOne = () =>
  String(Math.floor(Math.random() * 10));

export const getRandomNumberLengthTwo = () =>
  String(Math.floor(Math.random() * 90 + 10));

export const getRandomNumberLengthThree = () =>
  String(Math.floor(Math.random() * 900) + 100);

export const getRandomLengthOneNotZero = () =>
  String(Math.floor(Math.random() * 9) + 1);

/**
 * Generates a random number of length 1, 2, or 3 with the
 * same probability of any number length
 * @param limit If limit = 2, will limit the outcome to either 1 or 2 length string numbers
 */
export const generateRandomNumberWithRandomLength = (limit: 2 | 3 = 3) => {
  const length = (Math.floor(Math.random() * limit) + 1) as 1 | 2 | 3;
  return match(length)
    .with(1, () => getRandomNumberLengthOne())
    .with(2, () => getRandomNumberLengthTwo())
    .with(3, () => getRandomNumberLengthThree())
    .exhaustive();
};
