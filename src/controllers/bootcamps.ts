import BootcampModel from '~/models/Bootcamp';
import { ErrorResponse } from "~/utils/errorResponse";
import { geocoder } from '~/utils/geocoder';
import { paginate, queryGenerator, relationsGenerator } from "~/utils/query";
import { NextFunction, Request, Response } from "../types";



class BootcampsController {

    /** get data */
    async all(req: Request, res: Response, next: NextFunction) {
        let query = queryGenerator({ req, model: BootcampModel });
        const result = await paginate({
            req,
            query,
            model: BootcampModel
        });

        res.status(200).json({
            success: true,
            ...result
        });
    }

    /** get by id */
    async get(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        let query = BootcampModel.find({ _id: id });
        query = relationsGenerator({ req, query });
        const bootcamp = await query;
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
        const bootcamp = await BootcampModel.findById(id);
        if (!bootcamp) {
            return next(new ErrorResponse(`Bootcamp not found with id ${id}`, 404));
        }
        bootcamp.remove();
        res.status(200).json({ success: true, msg: 'bootcamp deleted successfully' });
    }

    /** get bootcamp witch certain radius*/
    async getBootcampInRadius(req: Request, res: Response, next: NextFunction) {
        const { zipcode, distance } = req.params;

        // get lan/lon from geocoder
        const loc = await geocoder.geocode(zipcode);
        const info = loc[0];
        const { latitude, longitude } = info;


        // Calc radius using radians
        // Divide distance by radius of earth
        // Earth radius = 3,958 mil
        const radius = parseInt(distance) / 3958;
        const bootcamps = await BootcampModel.find({
            location: { $geoWithin: { $centerSphere: [[longitude, latitude], radius] } }
        });

        res.status(200).json({
            success: true,
            count: bootcamps.length,
            data: bootcamps
        });
    }

}

export default BootcampsController;