import { RequestHandler } from "express";
import { ValidationChain } from "express-validator";
import { make, MiddleHandler, validate } from "./middleware";

export const controller = (arg1: MiddleHandler | ValidationChain[][], arg2?: MiddleHandler): Array<RequestHandler> => {
  let serve: MiddleHandler;
  let validations: ValidationChain[];
  if (!arg2 || typeof arg1 === "function")
    serve = <MiddleHandler>arg1;
  else
    serve = arg2!;

  if (!Array.isArray(arg1))
    validations = [];
  else
    validations = arg1.reduce((accum, validator) => accum.concat(validator), []);

  return [
    make(async (req, res) => {
      res.result = {};
    }),
    ...validations,
    validate(),
    make(serve),
    make((req, res) => {
      let { result, meta, file, repath, filestream } = res;
      if (repath) {
        res.redirect(repath);
        return;
      }

      if (!result) return;
      if (filestream) {
        if (filestream.content_length)
          res.setHeader("Content-Length", filestream.content_length);
        if (filestream.content_type)
          res.setHeader("Content-Type", filestream.content_type);
        res.writeHead(200);
        filestream.stream.pipe(res);
      } else if (file) {
        res.status(200).send(file);
      } else {
        res.status(200).send({ result, meta });
      }
    }),
  ];
};