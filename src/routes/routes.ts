import { Response, Request, NextFunction } from "express";
import * as LoginController from "../controllers/LoginController"
import * as ListController from "../controllers/ListController"
import *  as middleWare from "../utils/Middleware"
import { ResponseCode } from "../utils/ResponseCode";
const router = require('express').Router();


router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    res.send({ responseCode: ResponseCode.EVERYTHING_IS_OK, reponseMessage: "App is running at port: " + process.env.PORT })
})

// singup user if not exist
router.post("/signup", LoginController.signup);
// login already existing user
router.get("/login", LoginController.login);

// get task list
router.get("/get_task_list", middleWare.checkToken, ListController.getTaskList);
// create task for user
router.post("/create_task", middleWare.checkToken, ListController.createTask);
// update existing task
router.patch("/update_task", middleWare.checkToken, ListController.updateTask);
// delete current task 
router.delete("/delete_task", middleWare.checkToken, ListController.deleteTask);

export default router
