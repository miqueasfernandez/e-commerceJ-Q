import passport from "passport";
import local from "passport-local";
import jwt from "passport-jwt";
import userModel from "../dao/models/user.model.js";
import { createHash, isvalidPassword } from "../utils/hashbcrypt.js";
import { JWT_SECRET } from "./config.js";

const JWTStrategy = jwt.Strategy; //strategy core of jwt
const ExtractJWT = jwt.ExtractJwt;// jwt extractor, extract token from header, body or cookies


const localStrategy = local.Strategy;

const initializedPassport = () =>  { 
    //create new local strategy to register and login users
    //passreqtocallback: true, it means that the callback function will receive the request object as its first argument
    //usernameField: "email", it means that the username will be the email
    passport.use ("register", new localStrategy({passReqToCallback: true, usernameField: "username"}, async (req, username, password, done) => 
    {
        const { first_name, last_name,email, age } = req.body; // get the data from the request body
        try 
        {
            let user = await userModel.findOne({ username:username }); //check if the user already exists
            if (user) {
                return done(null, false, { message: "User already exists" }); //if the user already exists, return false, if null the user doesn't exist
            }

            let newUser = {
                first_name,
                last_name,
                email,
                username,
                age,
                password: createHash(password), //hash the password
                role: "user"
            
            }
            let result = await userModel.create(newUser); //create the user
            
            done(null, result);
        }
        catch (error) 
        {
            return done ("user not created" + error);
        }
    }))

    passport.use ("login", new localStrategy({usernameField: "username"}, async (username, password, done) =>{
        try {
            let user = await userModel.findOne({username: username}); //check if the user exists with the username
            if (!user) { return done (null, false) }
            if (!isvalidPassword(password, user.password)) 
            return done(null, user);
        } catch (error) {
            return done("user not found" + error);
        }
    }))

    passport.serializeUser((user,done)=>{
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById({id: id});
        done(null, user);
    })
    const cookieExtractor = req => {let token = null; if (req && req.cookies) {token = req.cookies["CookieTokenjwt"];}return token;};//verified if the cookie exists and get the token from the cookies

    passport.use("jwt", new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]), //extract the token from the cookies
        secretOrKey: JWT_SECRET,

    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload);
        } catch (error) {
            return done(error);
        }
    }))

}

export default initializedPassport;