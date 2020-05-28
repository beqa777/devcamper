import { NextFunction, Request, Response } from "../types";
import BootcampModel from '~/models/Bootcamp';
import { ErrorResponse } from "~/utils/errorResponse";


class BootcampsController {

    /** get data */
    async all(req: Request, res: Response, next: NextFunction) {
        const bootcamps = await BootcampModel.find();
        res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps });
    }

    /** get by id */
    async get(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        const bootcamp = await BootcampModel.findById(id);
        if (!bootcamp) {
            return next(new ErrorResponse(`Bootcamp not found with id ${id}`, 404));
        }
        res.status(200).json({ success: true, data: bootcamp });
    }

    /** create record */
    async post(req: Request, res: Response, next: NextFunction) {
        const bootcamp = await BootcampModel.create(req.body);
        res.status(201).json({ success: true, data: bootcamp });
    }

    /** edit record */
    async put(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        const bootcamp = await BootcampModel.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        });

        if (!bootcamp) {
            return next(new ErrorResponse(`Bootcamp not found with id ${id}`, 404));
        }
        res.status(200).json({ success: true, data: bootcamp });
    }

    /** delete record */
    async delete(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        const bootcamp = await BootcampModel.findByIdAndDelete(id);
        if (!bootcamp) {
            return next(new ErrorResponse(`Bootcamp not found with id ${id}`, 404));
        }
        res.status(200).json({ success: true, msg: 'bootcamp deleted successfully' });
    }

}

export default BootcampsController;