import * as e from "express";
import { Query } from "express-serve-static-core";

// **** Express **** //

export interface IReq<T = void> extends e.Request {
  body: T;
}

export interface IReqQuery<T extends Query, U = void> extends e.Request {
  query: T;
  body: U;
}

export interface IRes extends e.Response {}

export interface IBaseQuery extends Query {
  current: string;
  size: string;
}

interface IPhotoOrderItem {
  id: number | string;
  photoSrc: string;
  photoOrder: number;
}

export interface IUpdateReq {
  id?: number;
  status?: 0 | 1;
  photos?: IPhotoOrderItem[];
  isTop?: 0 | 1;
}

export interface IReviewReq {
  id: number;
  status: 0 | 1;
}
