import { controller, query_meta, Request, Response } from "@server/middlewares";
import { Invoice } from "@server/models";

export default controller(async (req: Request, res: Response) => {
  const options = req.parse_query!();
    
  const all_rows = await Invoice.findAll();
  const data = await Invoice.findAll({ ...options });
  const count = all_rows.length;

  res.result.models = data;
  res.result.meta = query_meta(options, count);
});
