import { NextFunction, Request, Response } from "../types";
import { Color } from "~/globals";


class BootcampsController {

    /** get data */
    all(req: Request, res: Response, next: NextFunction) {
        res.status(200).json({ success: true, msg: 'show all bootcamps' });
    }

    /** get by id */
    get(req: Request, res: Response, next: NextFunction) {
        res.status(200).json({ success: true, msg: 'get specific bootcamps' });
    }

    /** create record */
    post(req: Request, res: Response, next: NextFunction) {
        res.status(200).json({ success: true, msg: 'create create bootcamp' });
    }

    /** edit record */
    put(req: Request, res: Response, next: NextFunction) {
        res.status(200).json({ success: true, msg: 'update specific bootcamps' });
    }

    /** delete record */
    delete(req: Request, res: Response, next: NextFunction) {
        res.status(200).json({ success: true, msg: 'delete specific bootcamps' });
    }

}

export default BootcampsController;