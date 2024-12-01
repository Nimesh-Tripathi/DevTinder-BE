const express = require("express")

const authRouter = express.Router();

authRouter.get("/feed", async (req, res) => {

    const userEmail = req.body.emailId;

    try {
        const all = await User.find({ emailId: userEmail });
        // const all =  await User.find({});
        res.send(all)
    } catch (error) {
        res.status(404).send("error fetching all users")
    }
})

authRouter.get("/find", async (req, res) => {

    const userID = req.body.id;

    try {
        const ans = await User.findById(userID);
        res.send(ans)
    } catch (error) {
        res.status(404).send("user not found");
    }
})


module.exports = authRouter