import { NextFunction, Request, Response } from "../types";
import BootcampModel from '~/models/Bootcamp';


class BootcampsController {

    /** get data */
    async all(req: Request, res: Response, next: NextFunction) {
        try {
            const bootcamps = await BootcampModel.find();
            res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps });
        } catch (error) {
            res.status(400).json({ success: false, msg: error.message });
        }
    }

    /** get by id */
    async get(req: Request, res: Response, next: NextFunction) {
        try {
            const bootcamp = await BootcampModel.findById(req.params.id);
            if (!bootcamp) {
                throw new Error('Incorrect id')
            }
            res.status(200).json({ success: true, data: bootcamp });
        } catch (error) {
            res.status(400).json({ success: false, msg: error.message });
        }
    }

    /** create record */
    async post(req: Request, res: Response, next: NextFunction) {
        try {
            const bootcamp = await BootcampModel.create(req.body);
            res.status(201).json({ success: true, data: bootcamp });
        } catch (error) {
            res.status(400).json({ success: false, msg: error.message });
        }
    }

    /** edit record */
    async put(req: Request, res: Response, next: NextFunction) {
        try {
            const bootcamp = await BootcampModel.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true
            });

            if (!bootcamp) {
                throw new Error('Bad request')
            }
            res.status(200).json({ success: true, data: bootcamp });

        } catch (error) {
            res.status(400).json({ success: false, msg: error.message });
        }
    }

    /** delete record */
    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const bootcamp = await BootcampModel.findByIdAndDelete(req.params.id);
            if (!bootcamp) {
                throw new Error('Incorrect id')
            }
            res.status(200).json({ success: true, msg: 'bootcamp deleted successfully' });
        } catch (error) {
            res.status(400).json({ success: false, msg: error.message });
        }
    }

}

export default BootcampsController;