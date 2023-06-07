import { ExpressValidator } from "express-validator";

const validate = new ExpressValidator(
  {},
  {
    filterSize: async function (value: number | undefined) {
      if (!value || value <= 0) return 10;
      return value;
    },
    filterCurrent: async function (value: number | undefined) {
      if (!value || value <= 0) return 0;
      return value - 1;
    },
  }
);

export default { ...validate };
