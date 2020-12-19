import CrudModel from "@server/models/crud_model";
import Datasource from "@server/models/datasource";
import { model_specs, model_utils } from "@server/utilities";
const sequelize = Datasource.source("default-db");

class Invoice extends CrudModel {
  static TABLENAME = "invoice";

  public invoice_id!: string | null;
  public amount!: number | null;
  public due_on!: string | null;
  public selling_price!: number | null;

  toJSON(): object {
    var values: any = Object.assign({}, this.get());
    return values;
  }
};

const hooks = { };

Invoice.init({
  invoice_id: model_specs.generic_string(),
  due_on: model_specs.generic_string(),
  amount: model_specs.decimal(),
  selling_price: model_specs.decimal(),
}, {
  ...model_utils.model_defaults(Invoice.TABLENAME),
  hooks, sequelize,
});
export default Invoice;
