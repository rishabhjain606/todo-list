import * as _ from "lodash"
import * as jwt from "jsonwebtoken"
import Logger from "./Logger";
import { v4 as uuidv4 } from 'uuid';

export const checkRequest = (array: string[], obj: any): boolean => {
    for (let i of array) {
        if (obj[i] == undefined || obj[i] == "")
            return false;
    }
    return true;
}

export const generateToken = (email: string) => {
    const jwt_secret = process.env.JWT_KEY;
    Logger.info(email)
    const validity = { expiresIn: process.env.JWT_EXPIRY }
    const token = jwt.sign({ email: email }, jwt_secret, validity)
    return token
}

export const generateRandomId = () => {
    return uuidv4();
}