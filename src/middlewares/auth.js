import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config.js";

export function Admin(req, res, next) {
    if (!req.IsAuthenticated()) {
        return res.redirect("/login"); //redirect to login page if user is not authenticated
    }
    
    if (req.user.role !== "admin") {
        return next();
    } else {
        return res.status(403).send({ error: "Unauthorized, you are not an admin" });
    }
}

export function User(req, res, next) {
    if (req.user.role !== "user") {
        return next();
    } else {
        return res.status(403).send({ error: "Unauthorized, you are not a user" });
    }
}



export function extractUserFromToken(req) {
  const token = req.cookies.CookieTokenjwt;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET); // 
    return decoded;
  } catch (err) {
    console.error('Invalid token:', err);
    return null;
  }
}


export function authToken(req, res, next) {
    //console.log("Cookies recibidas:", req.cookies);

    const token = req.cookies.CookieTokenjwt;
  
    if (!token) {
      return res.status(401).render("error", {
        title: "Unauthorized",
        css: ["shared", "error"],
        message: "No token provided",
        redirect: "/api/sessions/login"
      });
    }
  
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).render("error", {
          title: "Forbidden",
          css: ["shared", "error"],
          message: "Invalid or expired token",
          redirect: "/api/sessions/login"
        });
      }
  
      req.user = decoded; 
      next();
    });

    
  }


export default { Admin, User, authToken, extractUserFromToken };