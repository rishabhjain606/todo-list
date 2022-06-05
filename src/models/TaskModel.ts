import * as mongoose from "mongoose";

export interface ListInterface {
    email: string, // unique email id of the user
    text: string,
    id: string
}

const ListSchema = new mongoose.Schema({
    email: { type: String, index: true },
    text: { type: String },
    id: { type: String, unique: true, index: true }
}, { timestamps: true })

export default mongoose.model("list", ListSchema)