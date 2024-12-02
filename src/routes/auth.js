const express = require("express")
const User = require("../models/user");
const { ValidateSignUpData } = require("../utils/validation")
const bcrypt = require("bcrypt")


const authRouter = express.Router();


authRouter.post("/signUp", async (req, res) => {

    try {
        //valiadtion
        ValidateSignUpData(req);

        const { firstName, lastName, emailId, password } = req.body

        //hashing the password
        const passwordHash = await bcrypt.hash(password, 10);
        // console.log(passwordHash);

        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        });


        await user.save();
        res.send("user added successfully");
    } catch (error) {
        res.status(404).send("error saving the user: " + error.message)
    }
})

authRouter.post("/logIn", async (req, res) => {
    const { emailId, password } = req.body;

    try {
        const user = await User.findOne({ emailId });
        if (!user) {
            throw new Error("user not found");
        }

        // const pass = await bcrypt.compare(password, user.password); 
        const pass = await user.validatePassword(password);

        if (pass) {
            //create a JWT token
            // const token = await jwt.sign({ _id: user._id }, "Nimesh",{expiresIn: "1d"})
            const token = await user.getJWT();

            //add the token to cookie and send the response back to user
            res.cookie("token", token, {expires : new Date(Date.now() + 8 * 3600000)})
            res.send("logged in successfully");
        }
        else {
            res.status(404).send("invalid password");
        }
    } catch (error) {
        res.send(error.message);
    }
})

authRouter.post("/logOut", async (req, res) => {
 
    res.clearCookie('token');
    res.send("Logout Successful !!")
    
})

module.exports = authRouter