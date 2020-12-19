import { QueryConfig } from "@server/middlewares";
import { ValidationChain } from "express-validator";
import { Model } from "sequelize";

export type CrudFilter = (config: QueryConfig) => void;
export type CrudFilterSpec = {
  [index: string]: CrudFilter;
};

export class CrudSpec {
  create?: string[];
  update?: string[];
  search?: string[];
  filter: CrudFilterSpec = {
    default: (config: QueryConfig) => {
      const { query, options } = config;
      if (query.sort) {
        const [key, order] = query.sort.split(":");
        options.add_order(key, order || "asc");
      } else {
        options.add_order("created_at", "desc");
      }
      options.add_order("id", "desc");
    },
  };

  validators: {
    create?: ValidationChain[][];
    update?: ValidationChain[][];
  } = {};
};

export default class CrudModel extends Model {
  [index: string]: any;

  public id!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static crud: CrudSpec;
  static primary_key?: string;
};