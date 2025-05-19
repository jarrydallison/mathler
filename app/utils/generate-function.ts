import {
  generateRandomNumberWithRandomLength,
  getRandomLengthOneNotZero,
  getRandomNumberLengthOne,
  getRandomNumberLengthThree,
  getRandomNumberLengthTwo,
  getRandomOperator,
  operators,
} from "./generate-numbers";

// This function avoids dividing by zero. Function constructor can handle it
// but it's just in poor taste.
export const getSingleNumber = (operator: (typeof operators)[number]) =>
  operator === "/" ? getRandomLengthOneNotZero() : getRandomNumberLengthOne();

/**
 * Generates a string function with the following properties:
 * 6 characters long
 * Numbers and operators can appear multiple times.
 * Order of operation applies (* and / are calculated before + and -)
 * For user experience, we should also ensure that the equation is
 * always a whole number
 */
export const generateFunction: () => string = () => {
  let equation = "";
  // First, we should generate a numeric string of length 1, 2, or 3
  // To ensure the probabiliy is the same for any length, we should
  // also randomly generate a desired length
  const firstNumber = generateRandomNumberWithRandomLength();
  // Index randomly into the operators
  equation += firstNumber + getRandomOperator();
  // 2 remaining characters (one 2 digit number)
  if (equation.length === 4) {
    equation += getRandomNumberLengthTwo();
  } else if (equation.length === 3) {
    // 3 remaining characters (3 digit number or 2 one digit numbers)
    const nextOperator = getRandomOperator();
    const nextNumber =
      Math.random() < 0.5
        ? getRandomNumberLengthOne()
        : getRandomNumberLengthThree();
    if (nextNumber.length === 3) {
      equation += nextNumber;
    } else {
      equation +=
        getRandomNumberLengthOne() +
        nextOperator +
        getSingleNumber(nextOperator);
    }
  } else {
    // 4 remaining characters (2 digit and 1 digit number)
    const nextOperator = getRandomOperator();
    equation += generateRandomNumberWithRandomLength(2) + nextOperator;
    if (equation.length === 4) {
      equation += getRandomNumberLengthTwo();
    } else {
      equation += getSingleNumber(nextOperator);
    }
  }
  // Evaluate the generated function. If not a whole number, recursively
  // generate a new one until we get a whole number back
  if (!Number.isInteger(new Function(`return ${equation}`)())) {
    return generateFunction();
  } else {
    return equation;
  }
};
