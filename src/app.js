const express = require("express")
const { ConnectDB } = require("./config/Database");
const User = require("./models/user");

const app = express();

app.use(express.json())

app.post("/signUp", async (req,res) => {

    const user = new User(req.body)

    try{
        await user.save();
        res.send("user added successfully")
    } catch (err) {
        res.status(404).send("error saving the user")
    }
        
})  

app.get("/feed", async(req,res) => {

    const userEmail = req.body.emailId;

    try {
        const all =  await User.find({emailId : userEmail});
        // const all =  await User.find({});
        res.send(all)
    } catch (error) {
        res.status(404).send("error fetching all users")
    }
})

app.get("/find", async(req,res) => {

    const userID = req.body.id;

    try {
        const ans = await User.findById(userID);
        res.send(ans)
    } catch (error) {
        res.status(404).send("user not found");
    }
})


app.delete("/delete", async(req,res) => {

    const userId = req.body.id;

    try {
        await User.findByIdAndDelete(userId);
        res.send("user deleted successfully")
    } catch (error) {
        res.status(404).send("user not found");
    }
})

app.patch("/update", async (req,res) => {
    const userId = req.body.id;
    const data = req.body;

    try {
        await User.findByIdAndUpdate(userId,data)
        res.send("user updated successfully");
    } catch (error) {
        res.status(404).send("user not found");
    }
})

ConnectDB().then( () => {
    console.log("Database connected successfully");
    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    })
}).catch ( () => {
    console.log("Database connection failed");
})

