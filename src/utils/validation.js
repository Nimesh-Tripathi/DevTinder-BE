const validator = require("validator")

const ValidateSignUpData = (req) => {

    const { firstName, lastName, emailId, password} = req.body;

    if(!firstName || !lastName){
        throw new Error("Please enter firstname and lastname")
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Invalid email");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Password must be at least 8 characters long");
    }
}

module.exports = { ValidateSignUpData }