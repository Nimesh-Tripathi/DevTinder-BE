const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const user = require("../models/user");
const userRouter = express.Router();


userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {

        const user = req.user;

        const connectionRequest = await ConnectionRequestModel.find({ toUserId: user._id, }).populate("fromUserId", ["firstName", "lastName"]);

        res.json({ message: "Data fetched successfully", data: connectionRequest })

    } catch (error) {
        res.status(404).send("Error: " + error.message)
    }
})


userRouter.get("/user/connections", userAuth, async (req, res) => {

    try {

        const user = req.user;

        const connectionRequest = await ConnectionRequestModel.find({
            $or: [
                { toUserId: user._id, status: "accepted" },
                { fromUserId: user._id, status: "accepted" },
            ],
        }).populate("fromUserId", ["firstName", "lastName"]).populate("toUserId", ["firstName", "lastName"]);

        const data = connectionRequest.map((row) => {
            if(row.fromUserId._id.toString() === user._id.toString()){
                return  row.toUserId;
            }
            return row.fromUserId;
        });

        res.json({ data })

    } catch (error) {
        res.status(404).send("Error: " + error.message)
    }
})


userRouter.get("/find", async (req,res) => {
    try {

        const data = await user.find({});

        res.send(data);
        
    } catch (error) {
        res.status(404).send("Error: " + error.message)
    }
})


// authRouter.get("/feed", async (req, res) => {

//     const userEmail = req.body.emailId;

//     try {
//         const all = await User.find({ emailId: userEmail });
//         // const all =  await User.find({});
//         res.send(all)
//     } catch (error) {
//         res.status(404).send("error fetching all users")
//     }
// })

// authRouter.get("/find", async (req, res) => {

//     const userID = req.body.id;

//     try {
//         const ans = await User.findById(userID);
//         res.send(ans)
//     } catch (error) {
//         res.status(404).send("user not found");
//     }
// })


module.exports = userRouter