import * as DataLoader from "dataloader";
import { Request, Response } from "express";
import { Redis } from "ioredis";
import { User } from "../entity/User";

export interface Mycontext {
  req: Request;
  redis: Redis;
  url: string;
  res: Response;
  userLoader: DataLoader<string, User>;
}
