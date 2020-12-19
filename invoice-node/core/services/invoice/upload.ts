import csv from "csvtojson";
import moment from "moment";
import { BadRequestError } from "@server/errors";
import { controller, Request, Response } from "@server/middlewares";
import { chirp } from "@server/utilities";
import { Invoice } from "@server/models";

export const uploadCSV = () => {
  return controller(async (req: Request, res: Response) => {
    const file = req.files!.invoice;
    if (!file)
      throw new BadRequestError("file not found:invoice");
    const csvData = file.data.toString('utf8');
    const result = await csv().fromString(csvData);
    const all_rows = await Invoice.findAll();
    const all_invoice_ids = all_rows.map((row: Invoice) => row.invoice_id);

    let invoices =  result.map((row: any) => {
      const amount = parseFloat(row["Amount"]);
      const invoice_id = row["Invoice ID"];
      
      if (!amount) return null;

      if(all_invoice_ids.includes(invoice_id)) return null;

      const due_on = row["Due On"];
      let coefficient = 0.3;
      const duration = moment.duration(moment(due_on, "YYYY.MM.DD").diff(moment()));
      const days = duration.asDays();
      if (days > 30) {
        coefficient = 0.5;
      }
      const selling_price = amount * coefficient;
      return { invoice_id, amount, due_on, selling_price }
    });
    invoices = invoices.filter((invoice: any) => invoice !== null);
    await Invoice.bulkCreate(invoices);

    res.result.success = true;
  });
};