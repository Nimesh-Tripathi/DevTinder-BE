const mongoose = require("mongoose");
const validator = require("validator")

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

module.exports = mongoose.model("User",userSchema)

