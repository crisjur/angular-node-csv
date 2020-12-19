import { controller, Request, Response } from "@server/middlewares";

export default controller(async (req: Request, res: Response) => {
  res.result = { success: true };
});
