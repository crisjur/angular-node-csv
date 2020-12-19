import { Transaction } from "sequelize";
import Datasource from "./datasource";

type TransactionCallback<T> = (t: Transaction) => PromiseLike<T>;
type TransactionExecutor = <T>(autoCallback: TransactionCallback<T>) => Promise<T>;
type TransactionExecutorResponse = { run: TransactionExecutor };

export default (transaction?: Transaction, source: string = "default-db"): TransactionExecutorResponse => {
  const sequelize = Datasource.source(source);
  let run;
  if (transaction)
    run = async <T>(autoCallback: TransactionCallback<T>): Promise<T> => {
      return await autoCallback(transaction);
    };
  else
    run = sequelize.transaction.bind(sequelize);

  return { run };
};

