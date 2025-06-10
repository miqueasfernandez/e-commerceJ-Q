import { Router } from "express";
import userController from "../controllers/users.controller.js";
import passport from "passport";
import { validateFields } from "../middlewares/validatefields.js";
import { registerValidation } from "../validators/validator.js";
import { passportCall } from "../utils/utils.js";
import { upload } from "../utils/multer.js";
import { authToken } from "../middlewares/auth.js";

const router = Router();


// Rute to render the login page
router.get('/login', (req, res) => {
    res.render('login', {
        title: 'Login',
        css: ['shared', 'login']
    });  
});

// Rute to render the register page
router.get('/register', (req, res) => {
    res.render('register', {
        title: 'Register',
        css: ['shared', 'register']
    });
});

router.get("/editprofile", (req, res) => {
    // if (!req.session.user) {
    //     return res.status(401).render("error", {
    //     message: "Session expired. Please log in again.",
    //     redirect: "/api/sessions/login",
    //     });
    // }
    res.render("editprofile", {
      title: "Edit Profile",
      css: ["editprofile"],
    });
    }
);
  
  
router.post("/editprofile",authToken, upload.single("profilePic"), userController.updateProfile);
router.post("/login", userController.loginUser);
router.post("/register", registerValidation, validateFields('register'), userController.createUser);
router.post("/logout", userController.logout);
router.get("/current", authToken, userController.current);


export default router;