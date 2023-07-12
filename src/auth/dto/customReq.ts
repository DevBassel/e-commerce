import { Request } from "express";

export interface customReq extends Request {
  user?: any;
}
