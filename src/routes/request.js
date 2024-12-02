const express = require("express")
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const user = require("../models/user");
const connectionRequestRouter = express.Router();

connectionRequestRouter.post("/request/send/:status/:toUserId",userAuth,async (req,res) => {

    try {

        const fromUserId = req.user._id;

        const toUserId = req.params.toUserId;

        const status = req.params.status;

        const allowedStatus = ["ignored","interested"];

        if(!allowedStatus.includes(status)){
            return res.status(400).json({message: "Invalid status type"});
        }

        const toUser = await user.findById(toUserId);

        if(!toUser){
            return res.status(404).json({message: "User Not Found!! "})
        }

        const existingConnectionRequest = await ConnectionRequestModel.findOne({
            $or : [
                { fromUserId , toUserId},
                { fromUserId: toUserId , toUserId: fromUserId}
            ]
        })

        if(existingConnectionRequest){
            return res.status(400).send({message: "Connection Request Already Exists!! "});
        }

        const connectionRequest =  new ConnectionRequestModel({fromUserId,toUserId,status});
    
        const data = await connectionRequest.save();

        res.json({
            message: req.user.firstName + " is " + status+ " in "+ toUser.firstName,
            data,
        })

    } catch (error) {
        res.status(404).send("Error: " + error.message)
    }
})

connectionRequestRouter.post("/request/review/:status/:requestId",userAuth, async(req,res) => {
    try {

        const loggedInUser = req.user;

        const { status , requestId } = req.params;

        const allowedStatus = ["accepted","rejected"];

        if(!allowedStatus.includes(status)){
            return res.status(400).json({message: "Invalid status type"});
        }

        const connectionRequest = await ConnectionRequestModel.findOne({
            _id : requestId,
            toUserId : loggedInUser._id,
            status : "interested",
        })

        if(!connectionRequest){
            return res.status(404).json({message: "Connection Request Not Found!! "})
        }

        connectionRequest.status = status;

        const data = await connectionRequest.save();

        res.json({message : "Connection request " + status + data })
        
    } catch (error) {
        res.status(404).send("Error: "+ error.message)
    }
})


module.exports = connectionRequestRouter