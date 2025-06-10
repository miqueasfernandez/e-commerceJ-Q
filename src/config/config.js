import dotenv from "dotenv";
import program from "../utils/commander.js";

export const JWT_SECRET = "secret";

const {mode} = program.opts();
dotenv.config({
    path: mode === "dev" ? "./.env.dev" : "./.env.prod"
})

const configObject = {
    PORT: process.env.PORT, 
    MONGO_URL: process.env.MONGO_URL
}

export default configObject; 