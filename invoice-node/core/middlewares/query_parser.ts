import { number_or_zero } from "@server/utilities";
import { RequestHandler } from "express";
import moment from "moment";
import { FindOptions, IncludeOptions, Op, OrderItem as OrderItemOptions, ProjectionAlias, WhereOptions } from "sequelize";
import { make, Request, Response } from "@server/middlewares";

const DEFAULT_QUERY_LIMIT = 10;
export interface FilterDateOptions {
  first_date?: number;
  last_date?: number;
};
export interface FilterPriceOptions {
  low_price?: number;
  high_price?: number;
};
export type AttributeOptions = {
  exclude: string[];
  include?: (string | ProjectionAlias)[];
} | {
  exclude?: string[];
  include: (string | ProjectionAlias)[];
};

export type QueryExtras = { [index: string]: any };
export type QueryConfig = {
  query: any;
  extras: QueryExtras;
  options: QueryOptions;
};

export type QueryMeta = {
  count: number;
  limit?: number;
  offset?: number;
  search?: string;
};

export class QueryOptions implements FindOptions {
  search_value?: string;

  limit?: number;
  offset?: number;

  attributes?: AttributeOptions;
  include?: IncludeOptions[];
  order?: OrderItemOptions[];
  where: WhereOptions | any = {};

  search(search: string, columns: string[]) {
    this.search_value = search;
    this.where[Op.or] = columns.map((column: string): WhereOptions => ({ [column]: { [Op.like]: `%${search}%` } }));
  };
  add_include(specs: IncludeOptions) {
    if (!this.include) this.include = [];
    this.include.push(specs);
  };
  add_order(column: string, order: "asc" | "desc" = "asc") {
    if (!this.order) this.order = [];
    this.order.push([column, order]);
  };
  filter_date(dates: FilterDateOptions = {}, column: string = "created_at") {
    let { first_date, last_date } = dates;
    if (!first_date && !last_date) return;
    if (!this.where[column]) this.where[column] = {};

    if (first_date)
      this.where[column][Op.gte] = moment.unix(first_date);
    if (last_date)
      this.where[column][Op.lt] = moment.unix(last_date);
  };
  filter_price(dates: FilterPriceOptions = {}, column: string = "base_price") {
    let { low_price, high_price } = dates;
    if (!low_price && !high_price) return;
    if (!this.where[column]) this.where[column] = {};

    if (low_price)
      this.where[column][Op.gte] = moment.unix(low_price);
    if (high_price)
      this.where[column][Op.lt] = moment.unix(high_price);
  };
  add_attr_include(inclusion: string) {
    if (!this.attributes) this.attributes = { include: [] };
    if (!this.attributes?.include) this.attributes.include = [];
    this.attributes.include.push(inclusion);
  };
  add_attr_exclude(exclusion: string) {
    if (!this.attributes) this.attributes = { exclude: [] };
    if (!this.attributes?.exclude) this.attributes.exclude = [];
    this.attributes.exclude.push(exclusion);
  };

  static query_column(config: QueryConfig, column_key: string, query_key?: string) {
    query_key = query_key || column_key;
    const { query, options } = config;

    if (query[query_key])
      options.where[column_key] = query[query_key].split(",");
  };
};

export const parse_query = (): RequestHandler => {
  return make((req: Request, res: Response) => {
    if (req.parse_query) return;

    req.parse_query = (): QueryOptions => {
      const query = req.query;
      const options = new QueryOptions();
      options.offset = number_or_zero(query.offset);
      options.limit = number_or_zero(query.limit);

      if (options.limit === 0 && query.limit === undefined)
        options.limit = DEFAULT_QUERY_LIMIT;

      return options;
    };
  });
};

export const query_meta = (options: QueryOptions, count: number): QueryMeta => {
  return {
    count,
    limit: options.limit,
    offset: options.offset,
    search: options.search_value
  };
};