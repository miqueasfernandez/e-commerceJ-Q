import userService from "../services/user.services.js";
import jwt from "jsonwebtoken";
import UserDTO from "../dto/user.dto.js";
import { JWT_SECRET } from "../config/config.js";
import cartRepo from "../repositories/cart.repositories.js";
import userModel from "../dao/models/user.model.js";

class UserController {
    async createUser(req, res) {
        const {first_name, last_name,username, email, age, password, adminCode} = req.body;
        console.log("data from client: ", req.body);

        try {
            let role = "user";
            if (adminCode === "1234") role = "admin";
            // register new user and asign it a cart
            const Newuser = await userService.registerUser({first_name, last_name,username, email, age, password, role, cartId: await cartRepo.createCart()});
            console.log("user created successfully: ", Newuser);
            // create token for the user 
            const Token = jwt.sign({id: Newuser._id, username: Newuser.username, role: Newuser.role}, JWT_SECRET, {expiresIn: "1d"});
            console.log("token created successfully: ", Token);
            // save token in cookie 
            res.cookie("CookieTokenjwt", Token, {httpOnly: true, maxAge: 1000 * 60 * 60 * 24});
          
            res.redirect("/api/sessions/current");
           

        } catch (error) {
            console.log(error);
            res.status(401).render("error", {
                title: "Error",
                css: ['shared', 'error'], 
                message: "User already exists",
                redirect: "/api/sessions/register"
              });
        }
        
    }

    async loginUser(req, res) {
        const {username, password} = req.body;
        //console.log("data from client: ", {username, password});
        console.log("REQ.BODY:", req.body); // recibed DATA depuration

        try {
            const user = await userService.loginUser(username, password);
            const token = jwt.sign({id: user._id, username: user.username, role: user.role},JWT_SECRET, {expiresIn: "1d"});
            res.cookie("CookieTokenjwt", token, {httpOnly: true, secure: false, sameSite: "lax", maxAge: 1000 * 60 * 60 * 24});// secure: false -> for development, change to true for production
            res.redirect("/api/products");
        } catch (error) {
             
            res.status(500).render("error", {
                title: "Error",
                css: ['shared', 'error'], 
                message: "the User or the password are incorrect, please enter existing user or password",
                redirect: "/api/sessions/login"
              });
        }
        
    }

    async current (req, res) {
        try {
            const user = await userModel.findById(req.user.id).lean();
            if (!user) {
                return res.status(404).send("User not found");
            }
            res.render("home", {
                title: "Current user",
                css: ["shared", "home"],
                user,
            });

            
        } catch (error) {
             console.error("Error loading current user:", error);
            res.status(500).send("Internal server error");
        }
    }

    async logout (req, res) {
        res.clearCookie("CookieTokenjwt");
        res.redirect("/api/sessions/login");
    };

   async updateProfile(req, res) {
        try {
            const { username } = req.body;
            const profilePic = req.file
            ? `/uploads/${req.file.filename}` 
            : undefined;

            console.log("Username:", username);
            console.log("ProfilePic file:", req.file);
            console.log("User from token:", req.user); 

            const updateData = {};
            if (username) updateData.username = username;
            if (profilePic) updateData.profilePic = profilePic;

            const updatedUser = await userModel.findByIdAndUpdate(
            req.user.id,  
            updateData,
            { new: true }
            );

            if (!updatedUser) {
            return res.status(404).send("User not found");
            }

            res.redirect("/api/sessions/current");
        } catch (error) {
            console.error("Error updating profile:", error);
            res.status(500).send("Internal server error");
        }
    };

}

export default new UserController();