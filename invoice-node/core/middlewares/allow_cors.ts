import cors from "cors";

export const allow_cors = () => {
  return cors({
    origin: (origin, callback) => callback(null, true),
  });
};