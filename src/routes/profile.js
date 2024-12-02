const express = require("express")
const { userAuth } = require("../middlewares/auth")
const profileRouter = express.Router();
const { ValidateEditProfileData, ValidateStrongPassword } = require("../utils/validation")
const bcrypt = require("bcrypt")


profileRouter.get("/profile/view", userAuth, async (req, res) => {

    try {
        const user = req.user;

        res.send(user);
    }
    catch (error) {
        res.status(404).send("Error: " + error.message)
    }
})

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {

    try {
        if (!ValidateEditProfileData(req)) {
            throw new Error("Please enter valid field")
        }

        const loggedInUser = req.user;

        // console.log(loggedInUser);

        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

        await loggedInUser.save();

        res.json({
            messgae: `${loggedInUser.firstName}, your profile updated successfuly`,
            data: loggedInUser,
        })

    } catch (error) {
        res.status(404).send("Update failed: " + error.message);
    }
})

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
    try {

        const user = req.user;

        const userPass = user.password;

        const exsistPass = req.body.exsist;

        // console.log(exsistPass);

        const isCorrect = await bcrypt.compare(exsistPass, userPass);

        if (!isCorrect) {
            throw new Error("Existing password is not correct");
        }

        const newPass = req.body.new;

        if (!ValidateStrongPassword(newPass)) {
            res.send("Password is not strong");
        }

        const newPassHash = await bcrypt.hash(newPass, 10);

        user.password = newPassHash;

        await user.save();

        res.json({
            messgae: `${user.firstName}, your password updated successfuly`,
            data: user,
        })

    }
    catch(error){
        res.status(404).send("Error: "+ error.message)
    }

})

module.exports = profileRouter