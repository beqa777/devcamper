import ReviewModel from '../models/Review';
import BootcampModel from '../models/Bootcamp';
import { ErrorResponse } from "../utils/errorResponse";
import { paginate, queryGenerator, relationsGenerator } from "../utils/query";
import { NextFunction, Request, Response } from "../types";

class ReviewController {

    /**
     * @description Get all reviews or get review by bootcamp id
     * @route /reviews
     * @route /bootcamps/:bootcampId/courses
     * @param req 
     * @param res 
     * @param next 
     */
    async getReviews(req: Request, res: Response, next: NextFunction) {
        let query = queryGenerator({ req, model: ReviewModel });

        if (req.params.bootcampId) {
            query.find({ bootcamp: req.params.bootcampId });
        }
        const result = await paginate({
            req,
            query,
            model: ReviewModel
        });

        res.status(200).json({
            success: true,
            ...result
        });
    }


    /** get by id */
    async get(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        let query = ReviewModel.find({ _id: id });
        query = relationsGenerator({ req, query });
        const review = await query;

        if (!review) {
            return next(new ErrorResponse(`Review not found with id ${id}`, 404));
        }
        res.status(200).json({ success: true, data: review });
    }

    /** create record */
    async post(req: Request, res: Response, next: NextFunction) {
        req.body.user = req.user?.id;
        const bootcamp = await BootcampModel.findById(req.body.bootcamp);

        if (!bootcamp) {
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.body.bootcamp}`, 404))
        }

        const review = await ReviewModel.create(req.body);
        res.status(201).json({ success: true, data: review });
    }

    /** edit record */
    async put(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        let review = await ReviewModel.findById(id);

        if (!review) {
            return next(new ErrorResponse(`Review not found with id ${id}`, 404));
        }

        // Make sure review belongs to user or user is admin
        if (review.user.toString() !== req.user?.id && req.user?.role !== 'admin') {
            return next(new ErrorResponse(`User ${req.user?.id} is not authorized to update a review ${review._id}`, 401));
        }


        review = await ReviewModel.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({ success: true, data: review });
    }

    /** delete record */
    async delete(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        const review = await ReviewModel.findById(id);
        if (!review) {
            return next(new ErrorResponse(`Review not found with id ${id}`, 404));
        }

        // Make sure review belongs to user or user is admin
        if (review.user.toString() !== req.user?.id && req.user?.role !== 'admin') {
            return next(new ErrorResponse(`User ${req.user?.id} is not authorized to delete a review ${review._id}`, 401));
        }

        review.remove();
        res.status(200).json({ success: true, msg: 'Review deleted successfully' });
    }


}

export default ReviewController;