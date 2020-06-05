import { Request } from "../types";
import { Model, DocumentQuery } from "mongoose";
import { Color } from "../globals";

type QueryGeneratorParams = {
    req: Request,
    model: Model<any>
}
/**
 * filter, select query generator
 * @param args 
 */
export const queryGenerator = (args: QueryGeneratorParams) => {

    const { req, model } = args;

    // Copy request
    const reqQuery = { ...req.query };

    // Field to exclude
    const removeFields = ['select', 'sort', 'page', 'limit', 'relations'];

    //Loop over remove fields and delete from query
    removeFields.forEach(field => delete reqQuery[field]);

    let queryStr = JSON.stringify(reqQuery);
    // add $ sign gt|gte|lt|lte|in
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    let query = model.find(JSON.parse(queryStr));

    query = relationsGenerator({ query, req });

    //Select Fields
    if (req.query.select) {
        // Replace ',' with ' '
        const fields = req.query.select.toString().split(',').join(' ');
        query = query.select(fields);
    }

    // Sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.toString().split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }

    return query;
}


type PaginationGeneratorParams = {
    req: Request,
    query: DocumentQuery<any[], any, {}>,
    model: Model<any>
}
/**
 * paginate and return data
 * @param args 
 */
export const paginate = async (args: PaginationGeneratorParams) => {

    const { model, query, req } = args;
    const total = await model.countDocuments(query);

    let page = 1;
    if (req.query.page) {
        const queryPage = parseInt(req.query.page.toString(), 10) || 1;
        if (queryPage > 0) page = queryPage;
    }

    let limit = 100;
    if (req.query.limit) {
        limit = parseInt(req.query.limit.toString(), 10) || 100;
    }

    const startIndex = (page - 1) * limit;
    query.skip(startIndex).limit(limit);

    const data = await query;
    const endIndex = page * limit;

    let nextPage;
    let previousPage;

    if (endIndex < total) {
        nextPage = page + 1;
    }

    if (startIndex > 0) {
        previousPage = page - 1;
    }

    return {
        data,
        pagination: {
            total,
            count: data.length,
            limit,
            page,
            nextPage,
            previousPage
        }
    };

}

type PopulateGeneratorType = {
    req: Request,
    query: DocumentQuery<any[], any, {}>,
}
type PopulateFieldsType = Array<{ path: string, select: string }>;
export const relationsGenerator = (args: PopulateGeneratorType) => {
    let { query, req } = args;
    if (req.query.relations) {
        const populate = req.query.relations.toString();
        const populateFields: PopulateFieldsType = JSON.parse(populate);

        populateFields.forEach(field => {
            query = query.populate({
                path: field.path,
                select: field.select ? field.select.split(',').join(' ') : ''
            });
        });
    }
    return query;
}