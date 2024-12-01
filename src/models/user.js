const mongoose = require("mongoose");
const validator = require("validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const userSchema =  new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        minLength : 4,
        maxLength : 50,
    },
    lastName : {
        type : String,
    },
    emailId : {
        type : String,
        lowercase : true,
        required : true,
        unique : true,
        trim : true,
        // validate(value){
        //     if(!validator.isEmail(value)){
        //         throw new Error("emailID is not correct")
        //     }
        // }
    },
    password : {
        type : String,
        required : true,
        // validate(value){
        //     if(!validator.isStrongPassword(value)){
        //         throw new Error("password is not strong")
        //     }
        // }
    },
    age : {
        type : String,
        min : 18,
    },
    gender : {
        type : String,
        validate(value){
            if(!["male","female","other"].includes(value)){
                throw new Error("Invalid gender");
            }   
        }
    },
    photoUrl : {
        type : String,
        // default : "c:\Users\Hp\OneDrive\Desktop\dummy pic.png",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("URL is not correct")
            }
        }
    },
    about : {
        type : String,
        default : "this is a default about section"
    },
    skills : {
        type : [String],
    }
},{
    timestamps : true,
})

userSchema.methods.getJWT = async function () {
    const user = this;

    const token = await jwt.sign({ _id: user._id }, "Nimesh",{expiresIn: "1d"})

    return token;
}

userSchema.methods.validatePassword = async function (password) {
    const user = this;
    const passwordHash = user.password

    const pass = await bcrypt.compare(password, passwordHash);

    return pass;
}

module.exports = mongoose.model("User",userSchema)

