import BootcampModel from '~/models/Bootcamp';
import { ErrorResponse } from "~/utils/errorResponse";
import { geocoder } from '~/utils/geocoder';
import { paginate, queryGenerator, relationsGenerator } from "~/utils/query";
import { NextFunction, Request, Response } from "../types";
import path from 'path';
import fileUpload from 'express-fileupload';


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
        // Add user to req.body
        req.body.user = req.user?.id;

        // Check for published bootcamp
        const publishedBootcamp = await BootcampModel.findOne({ user: req.user?.id });

        // If the user is not admin, they can only add one bootcamp
        if (publishedBootcamp && req.user?.role !== 'admin') {
            return next(new ErrorResponse(`The user with ID ${req.user?.id} has already published a bootcamp`, 400))
        }

        const bootcamp = await BootcampModel.create(req.body);
        res.status(201).json({ success: true, data: bootcamp });
    }

    /** edit record */
    async put(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        let bootcamp = await BootcampModel.findById(id);

        if (!bootcamp) {
            return next(new ErrorResponse(`Bootcamp not found with id ${id}`, 404));
        }

        // Make sure user is bootcamp owner
        if (bootcamp.user.toString() !== req.user?.id && req.user?.role !== 'admin') {
            return next(new ErrorResponse(`User ${req.user?.id} is not authorized to update this bootcamp`, 401));
        }

        bootcamp = await BootcampModel.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({ success: true, data: bootcamp });
    }

    /** delete record */
    async delete(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        const bootcamp = await BootcampModel.findById(id);
        if (!bootcamp) {
            return next(new ErrorResponse(`Bootcamp not found with id ${id}`, 404));
        }

        // Make sure user is bootcamp owner
        if (bootcamp.user.toString() !== req.user?.id && req.user?.role !== 'admin') {
            return next(new ErrorResponse(`User ${req.user?.id} is not authorized to delete this bootcamp`, 401));
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

    async bootcampPhotoUpload(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        const bootcamp = await BootcampModel.findById(id);
        if (!bootcamp) {
            return next(new ErrorResponse(`Bootcamp not found with id ${id}`, 404));
        }

        // Make sure user is bootcamp owner
        if (bootcamp.user.toString() !== req.user?.id && req.user?.role !== 'admin') {
            return next(new ErrorResponse(`User ${req.user?.id} is not authorized to upload this bootcamp image`, 401));
        }

        if (!req.files) {
            return next(new ErrorResponse(`Please upload file`, 400));
        }

        let file: fileUpload.UploadedFile;

        if (Array.isArray(req.files.file)) {
            file = req.files.file[0];
        } else {
            file = req.files.file;
        }

        file = Array.isArray(file) ? file[0] : file

        // Make sure the image is photo

        if (!file.mimetype.startsWith('image')) {
            return next(new ErrorResponse(`Please choice image`, 400));
        }

        let maxFileSize = process.env.MAX_FILE_UPLOAD ? `${process.env.MAX_FILE_UPLOAD}` : '1000000';

        if (file.size > parseInt(maxFileSize)) {
            return next(new ErrorResponse(`Please upload image lest than ${process.env.MAX_FILE_UPLOAD} byte`, 400));
        }

        // Create custom filename
        file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`

        file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
            if (err) {
                console.log(err);
                return next(new ErrorResponse(`Problem with file upload`, 500));
            }
            await BootcampModel.findByIdAndUpdate(req.params.id, { photo: file.name })
        })

        res.status(200).json({
            success: true,
            data: file.name
        })

    }

}

export default BootcampsController;