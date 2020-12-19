import { Request, Response, make } from "@server/middlewares";
import moment from "moment";
import { chirp } from "@server/utilities";

const log_request = (req: Request, res: Response) => {
  const start = moment();
  return () => {
    const now = moment();
    const elapsed = `000000${now.diff(start, "ms")}`.substr(-6);
    const status = `    ${res.statusCode}`.substr(-4);
    chirp(elapsed, status, req.method, req.path);
  };
};

const finish_callback = (req: Request, res: Response) => {
  return () => {
    setTimeout(log_request(req, res));
  };
};

export const prepare_request = () => {
  return make((req: Request, res: Response) => {
    chirp("m: prepare_request");
    req.attr = {
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    };
    req.extras = {};
    res.on("finish", finish_callback(req, res));
  });
};