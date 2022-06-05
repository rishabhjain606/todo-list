import { Response, Request, NextFunction } from "express";
import * as _ from "lodash";
import { ResponseCode } from "../utils/ResponseCode";
import Logger from "../utils/Logger";
import ListModel, { ListInterface } from "../models/TaskModel"
import * as Utils from "../utils/GlobalFuntions"

/**
 *
 * Get task list for the user  
 * @param {Request} req email - generated from token, q - text to search
 * @param {Response} res
 * @param {NextFunction} next
 * @return {*} 
 */
export const getTaskList = async (req: Request, res: Response, next: NextFunction) => {
    Logger.info("Get list: " + JSON.stringify(req.query))
    try {
        let check: boolean = Utils.checkRequest(["email"], req.body);
        if (check) {
            let email = req.query.email;
            const limit = parseInt(req.query.limit || 10);
            const offset = parseInt(req.query.offset || 0);
            const searchText = req.query.q;
            let query = {
                email: email
            }
            if (!_.isNil(searchText) && !_.isEmpty(searchText)) {
                query["text"] = { $regex: searchText, $options: "i" }
            }
            let todo_list: ListInterface[] = await ListModel.find(query, { _id: 0, email: 0, __v: 0 }).skip(offset).limit(limit);
            let total_count: number = await ListModel.countDocuments(query);

            const result = {
                list: todo_list,
                total_count: total_count,
                offset: offset,
                limit: limit
            }
            return res.send({ responseCode: ResponseCode.EVERYTHING_IS_OK, responseMessage: "List fetched", result: result })


        } else {
            return res.send({ responseCode: ResponseCode.UNAUTHORIZED, responseMessage: "Please log in again" })
        }
    } catch (err) {
        Logger.errorStack("Error in getting task list: ", err)
        return res.send({ responseCode: ResponseCode.INTERNAL_SERVER_ERROR, responseMessage: "Interval Error. Please contact admin" })
    }
}

/**
 *
 * Create a new task for the user
 * @param {Request} req email - generated from token, text - text for the task
 * @param {Response} res
 * @param {NextFunction} next
 * @return {*} 
 */
export const createTask = async (req: Request, res: Response, next: NextFunction) => {
    Logger.info("Create task: " + JSON.stringify(req.body))
    try {
        let check: boolean = Utils.checkRequest(["email", "text"], req.body);
        if (check) {
            let email = req.body.email;
            let text = req.body.text;

            const listObject: ListInterface = {
                email: email,
                text: text,
                id: Utils.generateRandomId()
            }

            await ListModel.create(listObject);
            return res.send({ responseCode: ResponseCode.EVERYTHING_IS_OK, reponseMessage: "Task created successfully" })

        } else {
            return res.send({ responseCode: ResponseCode.BAD_REQUEST, reponseMessage: "Invalid input" })
        }
    } catch (err) {
        Logger.errorStack("Error in creating task: ", err)
        return res.send({ responseCode: ResponseCode.INTERNAL_SERVER_ERROR, responseMessage: "Interval Error. Please contact admin" })
    }
}

/**
 *
 * Update an existing task 
 * @param {Request} req email - generated from token, text - text to udpate, id- id of task to be updated
 * @param {Response} res
 * @param {NextFunction} next
 * @return {*} 
 */
export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
    Logger.info("Update task: " + JSON.stringify(req.body))
    try {
        let check: boolean = Utils.checkRequest(["email", "text", "id"], req.body);
        if (check) {
            let email = req.body.email;
            let text = req.body.text;
            let task_id = req.body.id;

            let listObject = await ListModel.findOne({ id: task_id }, { email: 1 });
            if (listObject) {
                if (listObject.email == email) {
                    await ListModel.updateOne({ id: task_id }, { $set: { text: text } });
                    return res.send({ responseCode: ResponseCode.EVERYTHING_IS_OK, reponseMessage: "Task Update" })
                } else {
                    return res.send({ responseCode: ResponseCode.NOT_ACCEPTABLE, reponseMessage: "Not allowed to update this task" })
                }
            } else {
                return res.send({ responseCode: ResponseCode.NOT_FOUND, reponseMessage: "Task not found" })
            }
        } else {
            return res.send({ responseCode: ResponseCode.BAD_REQUEST, reponseMessage: "Invalid input" })
        }
    } catch (err) {
        Logger.errorStack("Error in updating task: ", err)
        return res.send({ responseCode: ResponseCode.INTERNAL_SERVER_ERROR, responseMessage: "Interval Error. Please contact admin" })
    }
}

/**
 *
 * Delete an existing task
 * @param {Request} req email - generated from token, id- id of task to be deleted
 * @param {Response} res
 * @param {NextFunction} next
 * @return {*} 
 */
export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
    Logger.info("Delete task: " + JSON.stringify(req.body))
    try {
        let check: boolean = Utils.checkRequest(["email", "id"], req.body);
        if (check) {
            let email = req.body.email;
            let task_id = req.body.id;

            let listObject = await ListModel.findOne({ id: task_id }, { email: 1 });
            if (listObject) {
                if (listObject.email == email) {
                    await ListModel.deleteOne({ id: task_id });
                    return res.send({ responseCode: ResponseCode.RESOURCE_DELETED, reponseMessage: "Task Deleted" })
                } else {
                    return res.send({ responseCode: ResponseCode.NOT_ACCEPTABLE, reponseMessage: "Not allowed to delete this task" })
                }
            } else {
                return res.send({ responseCode: ResponseCode.NOT_FOUND, reponseMessage: "Task not found" })
            }


        } else {
            return res.send({ responseCode: ResponseCode.BAD_REQUEST, reponseMessage: "Invalid input" })
        }
    } catch (err) {
        Logger.errorStack("Error in deleting task: ", err)
        return res.send({ responseCode: ResponseCode.INTERNAL_SERVER_ERROR, responseMessage: "Interval Error. Please contact admin" })
    }
}