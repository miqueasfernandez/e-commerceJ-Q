import passport from "passport";


/*
  Function that receives a passport strategy and returns a middleware
 that executes the authenticate method of passport with the given strategy
 and a callback that assigns the user to the req object if the authentication
  is successful, or sends a 401 status if it fails.
  @param {string} Strategy - Name of the strategy to use for authentication
  @returns {function} - Middleware that calls passport.authenticate with the given strategy
 */
export const passportCall = (Strategy) => { return async (req, res, next) => {
        passport.authenticate(Strategy, function (error, user, info) {
            if (error) {
                return next({error: "error in passport"});
            }
            if(!user){
                return res.status(401).send({error: info.message ? info.message : info.toString()});
            }
            req.user = user;
            next();
        })(req, res, next);
    }   
}

/*
  Middleware that checks if the user has the required role.
  If the user's role does not match the required role, 
  it sends a 403 Unauthorized response. 
  @param {string} role - The required role for authorization.
  @returns {function} - Middleware function for role-based authorization.
 */

export const authorization = (role) => {
    return async (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).send({ error: "Unauthorized" });
        }
        next();
    }
    
}