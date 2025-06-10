import express from "express";
import displayRoutes from "express-routemap";
import mongoose from "mongoose";
import productRouter from "./src/routes/product.router.js"
import cartRouter from "./src/routes/cart.router.js"
import sessionRouter from "./src/routes/session.router.js"
import orderRouter from "./src/routes/order.router.js"
import { engine } from "express-handlebars";
import exphbs from "express-handlebars";
import { create } from 'express-handlebars'; 
import path from "path";
import { fileURLToPath } from 'url';
import cookieParser from "cookie-parser";
//console.log("Mongo URI:", process.env.MONGO_URL); for depuration
import configObject, { JWT_SECRET } from "./src/config/config.js"
import MongoStore from "connect-mongo";
import session from "express-session";
import cors from "cors";
import passport from "passport";
import  initializedPassport  from "./src/config/passportConfig.js";
import dotenv from "dotenv";

 dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const {MONGO_URL, PORT} = configObject; 


// Middlewares

app.use(express.json());
//app.use(express.static(path.join(__dirname, "src", "public")));   
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
initializedPassport();
app.use(session({
    secret: JWT_SECRET,
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://kanadesing:negros333@cluster0.cdmifvc.mongodb.net/ecommercejyq",
    }),
    cookie: { secure: false }
}))
const whitelist = ["http://localhost:8080"];
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || whitelist.includes(origin)) {
            callback(null, true);
        }else {
            callback(new Error("Not allowed by CORS"));
        }
    }
}
app.use(cors(corsOptions));
// Routes
app.use("/api/products", productRouter) 
app.use("/api/carts", cartRouter)
app.use("/api/sessions", sessionRouter)
app.use("/api/order", orderRouter)


//express-handlebars
const hbs = exphbs.create({
  extname: ".handlebars",
  defaultLayout: "main",
  partialsDir: path.join(process.cwd(), "src", "views", "partials")
});

//app.engine("handlebars", engine());
app.engine("handlebars", hbs.engine);
app.use(express.static(path.join(__dirname, "src", "public")));
app.set('views', path.join(__dirname, './src/views'));
app.set("view engine", "handlebars");


// Connect to MongoDB


mongoose.connect(MONGO_URL)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.log("Error fatal: ", error))





// listen server
const httpServer = app.listen(PORT, () => {
    displayRoutes(app)
    console.log(`listening port; ${PORT} successfully`)
});