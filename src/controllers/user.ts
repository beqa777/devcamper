import UserModel from '~/models/User';
import { ErrorResponse } from "~/utils/errorResponse";
import { paginate, queryGenerator, relationsGenerator } from "~/utils/query";
import { NextFunction, Request, Response } from "../types";

class UserController {

    /** get all data */
    async getUsers(req: Request, res: Response, next: NextFunction) {
        let query = queryGenerator({ req, model: UserModel });

        const result = await paginate({
            req,
            query,
            model: UserModel
        });

        res.status(200).json({
            success: true,
            ...result
        });
    }


    /** get by id */
    async get(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        let query = UserModel.find({ _id: id });
        query = relationsGenerator({ req, query });
        const user = await query;

        if (!user) {
            return next(new ErrorResponse(`User not found with id ${id}`, 404));
        }
        res.status(200).json({ success: true, data: user });
    }

    /** create record */
    async post(req: Request, res: Response, next: NextFunction) {
        const user = await UserModel.create(req.body);
        res.status(201).json({ success: true, data: user });
    }

    /** edit record */
    async put(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        let user = await UserModel.findById(id, req.body);

        if (!user) {
            return next(new ErrorResponse(`User not found with id ${id}`, 404));
        }

        user = await UserModel.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({ success: true, data: user });
    }

    /** delete record */
    async delete(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        const user = await UserModel.findById(id);
        if (!user) {
            return next(new ErrorResponse(`User not found with id ${id}`, 404));
        }
        user.remove();
        res.status(200).json({ success: true, msg: 'User deleted successfully' });
    }


}

export default UserController;