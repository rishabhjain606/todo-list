import * as mongoose from "mongoose";

export interface UserInterface {
    email: string, // unique email id of the user
    password: string, // password hash of the user
    full_name: string // full name of the user
}

const UserSchema = new mongoose.Schema({
    email: { type: String, unique: true, index: true },
    password: { type: String },
    full_name: { type: String },
}, { timestamps: true })

export default mongoose.model("user", UserSchema)