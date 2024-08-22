import { body, validationResult } from "express-validator";

// Validation middleware for user signup
export const signupValidationRules = () => [
  body("name").notEmpty().withMessage("Name is required"),
  body("mobile")
    .isLength({ min: 10, max: 10 })
    .withMessage("Mobile number must be 10 digits long")
    .isNumeric()
    .withMessage("Mobile number must be numeric"),
  body("email").isEmail().withMessage("Invalid email format"),
  body("dob")
    .isISO8601()
    .withMessage("Date of birth must be in YYYY-MM-DD format"),
  body("gender")
    .isIn(["male", "female", "other"])
    .withMessage("Gender must be male, female, or other"),
  body("address").notEmpty().withMessage("Address is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

// Function to check validation results
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};
