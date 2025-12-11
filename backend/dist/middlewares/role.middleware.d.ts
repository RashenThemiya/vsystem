import { Response, NextFunction } from "express";
import { RequestWithUser } from "../types/RequestWithUser.js";
export declare const authorizeRoles: (...roles: string[]) => (req: RequestWithUser, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=role.middleware.d.ts.map