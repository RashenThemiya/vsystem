import { Response, NextFunction } from "express";
import { RequestWithUser } from "../types/RequestWithUser.js";
export declare const authenticate: (req: RequestWithUser, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=auth.middleware.d.ts.map