import { validationResult } from "express-validator";

export const validateFields = (view) => {
    return (req, res, next) => {
        const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // extract the error messages
        const extractedErrors = errors.array().map(err => err.msg);

        // Render the original view with the extracted errors
        return res.status(400).render(view, { errors: extractedErrors, oldData: req.body });
    }

    next();
    };
};

