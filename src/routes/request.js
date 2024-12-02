const express = require("express")
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const connectionRequestRouter = express.Router();

connectionRequestRouter.post("/request/send/:status/:toUserId",userAuth,async (req,res) => {

    try {

        const fromUserId = req.user._id;

        const toUserId = req.params.toUserId;

        const status = req.params.status;

        const connectionRequest =  new ConnectionRequestModel({fromUserId,toUserId,status});
    
        const data = await connectionRequest.save();

        res.json({
            message:"Connection Request Sent Successfully",
            data,
        })

    } catch (error) {
        res.status(404).send("Error: " + error.message)
    }
})


module.exports = connectionRequestRouter