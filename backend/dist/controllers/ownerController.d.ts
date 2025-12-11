import { Request, Response } from "express";
export declare const createOwnerController: (req: Request, res: Response) => Promise<void>;
export declare const getAllOwnersController: (_req: Request, res: Response) => Promise<void>;
export declare const getOwnerByIdController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateOwnerController: (req: Request, res: Response) => Promise<void>;
export declare const deleteOwnerController: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=ownerController.d.ts.map