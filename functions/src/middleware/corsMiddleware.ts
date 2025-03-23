import * as cors from "cors";
import {Request, Response, NextFunction} from "express"; // ✅ Import types

// ✅ Configure CORS to allow requests from any origin
const corsHandler = cors({origin: true});

export const corsMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
  corsHandler(req, res, () => {
    next();
  });
};
