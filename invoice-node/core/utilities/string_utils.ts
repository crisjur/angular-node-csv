import { Headers } from "node-fetch";
import moment from "moment";

export const number_or_zero = (input: any): number => {
  switch (typeof input) {
    case "number": return input;
    default:
      return is_number(input) ? Number(input) : 0;
  }
};

export const is_number = (input: any): boolean => {
  return !isNaN(input) && isFinite(input);
};

export const log = (...args: any[]) => {
  let timestamp = moment().format("YYYY-MM-DD HH:mm:ss.SSS");
  console.log(timestamp, ...args);
};