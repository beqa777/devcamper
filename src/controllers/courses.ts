import CourseModel from '~/models/Course';
import BootcampModel from '~/models/Bootcamp';
import { ErrorResponse } from "~/utils/errorResponse";
import { paginate, queryGenerator, relationsGenerator } from "~/utils/query";
import { NextFunction, Request, Response } from "../types";



class CourseController {

    /**
     * @description Get all courses or get course by bootcamp id
     * @route /courses
     * @route /bootcamps/:bootcampId/courses
     * @param req 
     * @param res 
     * @param next 
     */
    async getCourses(req: Request, res: Response, next: NextFunction) {
        let query = queryGenerator({ req, model: CourseModel });

        if (req.params.bootcampId) {
            query.find({ bootcamp: req.params.bootcampId });
        }
        const result = await paginate({
            req,
            query,
            model: CourseModel
        });

        res.status(200).json({
            success: true,
            ...result
        });
    }


    /** get by id */
    async get(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        let query = CourseModel.find({ _id: id });
        query = relationsGenerator({ req, query });
        const course = await query;

        if (!course) {
            return next(new ErrorResponse(`Course not found with id ${id}`, 404));
        }
        res.status(200).json({ success: true, data: course });
    }

    /** create record */
    async post(req: Request, res: Response, next: NextFunction) {
        const bootcamp = await BootcampModel.findById(req.body.bootcamp);
        if (!bootcamp) {
            return next(new ErrorResponse(`Bootcamp not found with id ${bootcamp}`, 404));
        }

        const course = await CourseModel.create(req.body);
        res.status(201).json({ success: true, data: course });
    }

    /** edit record */
    async put(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;

        if (req.body.bootcamp) {
            const bootcamp = await BootcampModel.findById(req.body.bootcamp);
            if (!bootcamp) {
                return next(new ErrorResponse(`Bootcamp not found with id ${bootcamp}`, 404));
            }
        }

        const course = await CourseModel.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        });

        if (!course) {
            return next(new ErrorResponse(`Course not found with id ${id}`, 404));
        }
        res.status(200).json({ success: true, data: course });
    }

    /** delete record */
    async delete(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        const course = await CourseModel.findById(id);
        if (!course) {
            return next(new ErrorResponse(`course not found with id ${id}`, 404));
        }
        course.remove();
        res.status(200).json({ success: true, msg: 'Course deleted successfully' });
    }


}

export default CourseController;