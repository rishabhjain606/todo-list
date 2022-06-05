import { Response, Request, NextFunction } from "express";
import { ResponseCode } from "./ResponseCode"
import * as jwt from "jsonwebtoken"
import Logger from "./Logger";

export const checkToken = (req: Request, res: Response, next: NextFunction) => {
    let token = req.headers['x-access-token'];
    
    if (token) {
        const jwt_secret = process.env.JWT_KEY;
        jwt.verify(token, jwt_secret, (error, tokenDecoded) => {
            if (error) {
                return res.send({ responseCode: ResponseCode.UNAUTHORIZED, responseMessage: "Please log in again" })
            } else {
                if (tokenDecoded.email) {
                    if (req.method == "GET") {
                        req.query.email = tokenDecoded.email;
                    } else {
                        req.body.email = tokenDecoded.email;
                    }
                    next();
                } else {
                    return res.send({ responseCode: ResponseCode.UNAUTHORIZED, responseMessage: "Please log in again" })
                }
            }
        })
    } else {
        return res.send({ responseCode: ResponseCode.UNAUTHORIZED, responseMessage: "Please log in again" })
    }
}