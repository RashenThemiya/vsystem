import { Request } from "express";
export interface RequestWithUser extends Request {
    user?: {
        id: number;
        email: string;
        role: string;
    };
}
//# sourceMappingURL=RequestWithUser.d.ts.map