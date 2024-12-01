const express = require("express")
const { userAuth } = require("../middlewares/auth")
const profileRouter = express.Router();


profileRouter.get("/profile",userAuth, async (req, res) => {

    try {
        const user = req.user;

        res.send(user);
    }
    catch (error) {
        res.status(404).send("Error: "+error.message)
    }
})

profileRouter.patch("/update", async (req, res) => {
    const userId = req.body.id;
    const data = req.body;

    try {

        const ALLOWED_UPDATES = ["photoUrl", "about", "skills", "gender", "age", "id"];

        const isAllow = Object.keys(data).every(k => ALLOWED_UPDATES.includes(k));

        if (!isAllow) {
            throw new Error("update not allowed");
        }

        await User.findByIdAndUpdate(userId, data, { runValidators: true })
        res.send("user updated successfully");
    } catch (error) {
        res.status(404).send("Update failed: " + error.message);
    }
})



module.exports = profileRouter