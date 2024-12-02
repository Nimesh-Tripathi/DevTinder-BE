const validator = require("validator")

const ValidateSignUpData = (req) => {

    const { firstName, lastName, emailId, password } = req.body;

    if (!firstName || !lastName) {
        throw new Error("Please enter firstname and lastname")
    }
    else if (!validator.isEmail(emailId)) {
        throw new Error("Invalid email");
    }
    else if (!validator.isStrongPassword(password)) {
        throw new Error("Password must be at least 8 characters long");
    }
}

const ValidateEditProfileData = (req) => {

    const ALLOWED_UPDATES = ["photoUrl", "about", "skills", "gender", "age", "id", "firstName", "lastName", "emailId"];

    const isAllow = Object.keys(req.body).every(k => ALLOWED_UPDATES.includes(k));

    if (!isAllow) {
        throw new Error("update not allowed");
    }

    return isAllow;
}

const ValidateStrongPassword = (password) => {
    const isStrong = validator.isStrongPassword(password);

    return isStrong;
}


module.exports = { ValidateSignUpData , ValidateEditProfileData, ValidateStrongPassword }