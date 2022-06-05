import * as bodyParser from "body-parser";
import * as express from "express";
import { Response, Request, NextFunction } from "express";
import * as dotenv from "dotenv";
import * as mongoose from "mongoose";
import Logger from "./src/utils/Logger"
import routes from  "./src/routes/routes"

dotenv.config({ path: ".env" });
const app = express();
app.use(bodyParser.json());
app.use(routes)
app.set("port", process.env.PORT || 4000);

mongoose.connect(process.env.MONGO_CONNECTION_STRING, function (err) {
    if (err) {
        Logger.errorStack("Error in connecting mongodb", err);
    } else {
        Logger.info("mongodb connected successfully")
    }
})

app.listen(app.get("port"), () => {
    console.log(("App is running at http://localhost:%d"), app.get("port"));
});