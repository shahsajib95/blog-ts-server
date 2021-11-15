import { Request } from "express";

export const Pagination = (req: Request) => {
  let page = Number(req.query.page) * 1 || 1;
  let limit = Number(req.query.limit) * 1 || 3;
  let skip = (page - 1) * limit;

  return { skip, limit };
};
