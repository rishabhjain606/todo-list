import { Response, Request, NextFunction } from "express";
import * as _ from "lodash";
import Users, { UserInterface } from "../models/UsersModel";
import * as bcrypt from "bcrypt"
import * as Utils from "../utils/GlobalFuntions"
import Logger from "../utils/Logger";
import { ResponseCode } from "../utils/ResponseCode";

/**
 *
 * Sign-up user if user does not exist in DB
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @return {*} 
 */
export const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        Logger.info("Signup request: " + JSON.stringify(req.body))
        let check: boolean = Utils.checkRequest(["email", "password", "full_name"], req.body);
        if (check) {
            let email: string = req.body.email.toLowerCase();
            let password: string = req.body.password;
            let full_name: string = req.body.full_name.toLowerCase();

            let user_exist = await Users.findOne({ email: email })
            if (_.isNil(user_exist)) {
                const salt = bcrypt.genSaltSync(10);
                const password_hash = bcrypt.hashSync(password, salt);

                let user_obj: UserInterface = {
                    email: email,
                    password: password_hash,
                    full_name: full_name
                }
                await Users.create(user_obj);
                Logger.info("Creating user: " + JSON.stringify(user_obj))
                return res.send({ responseCode: ResponseCode.EVERYTHING_IS_OK, responseMessage: "User created successfully" })
            } else {
                return res.send({ responseCode: ResponseCode.ALREADY_EXIST, responseMessage: "User already exist, kindly login" })
            }
        } else {
            return res.send({ responseCode: ResponseCode.BAD_REQUEST, reponseMessage: "Invalid input" })
        }
    } catch (err) {
        Logger.errorStack("Error in signup: ", err)
        return res.send({ responseCode: ResponseCode.INTERNAL_SERVER_ERROR, responseMessage: "Internal Error. Please contact admin" })
    }
}
/**
 *
 * Authenticate and login user and return the JWT token
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @return {*} 
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        Logger.info("Login request: " + JSON.stringify(req.query.email))
        let check: boolean = Utils.checkRequest(["email", "password"], req.query);
        if (check) {
            let email: string = req.query.email.toLowerCase();
            let password: string = req.query.password;

            let user_exist: UserInterface = await Users.findOne({ email: email });
            if (!_.isNil(user_exist)) {

                let valid_password: boolean = await bcrypt.compare(password, user_exist.password);
                if (valid_password) {
                    let result = {
                        email: user_exist.email,
                        full_name: user_exist.full_name,
                        token: Utils.generateToken(user_exist.email)
                    }
                    return res.send({ responseCode: ResponseCode.EVERYTHING_IS_OK, responseMessage: "Login success", result: result })
                } else {
                    return res.send({ responseCode: ResponseCode.FORBIDDEN, responseMessage: "Password does not match" })
                }
            } else {
                return res.send({ responseCode: ResponseCode.NOT_FOUND, responseMessage: "User does not exist, please signup" })
            }
        } else {
            return res.send({ responseCode: ResponseCode.BAD_REQUEST, reponseMessage: "Invalid input" })
        }
    } catch (err) {
        Logger.errorStack("Error in signup: ", err)
        return res.send({ responseCode: ResponseCode.INTERNAL_SERVER_ERROR, responseMessage: "Interval Error. Please contact admin" })
    }
}