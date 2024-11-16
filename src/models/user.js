const mongoose = require("mongoose");

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
    },
    password : {
        type : String,
        required : true,
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
        default : "c:\Users\Hp\OneDrive\Desktop\dummy pic.png",
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

