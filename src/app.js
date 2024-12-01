const express = require("express")
const { ConnectDB } = require("./config/Database");
const User = require("./models/user");
const { ValidateSignUpData } = require("./utils/validation")
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
const { userAuth } = require("./middlewares/auth")

const app = express();

app.use(express.json())
app.use(cookieParser());

app.post("/signUp", async (req, res) => {

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

app.post("/logIn", async (req, res) => {
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

app.get("/profile",userAuth, async (req, res) => {

    try {
        const user = req.user;

        res.send(user);
    }
    catch (error) {
        res.status(404).send("Error: "+error.message)
    }
})

app.post("/sendConnectionRequest",userAuth,(req,res) => {

    const user = req.user;

    res.send(user.firstName + " sent the connection request")
})

app.get("/feed", async (req, res) => {

    const userEmail = req.body.emailId;

    try {
        const all = await User.find({ emailId: userEmail });
        // const all =  await User.find({});
        res.send(all)
    } catch (error) {
        res.status(404).send("error fetching all users")
    }
})

app.get("/find", async (req, res) => {

    const userID = req.body.id;

    try {
        const ans = await User.findById(userID);
        res.send(ans)
    } catch (error) {
        res.status(404).send("user not found");
    }
})


app.delete("/delete", async (req, res) => {

    const userId = req.body.id;

    try {
        await User.findByIdAndDelete(userId);
        res.send("user deleted successfully")
    } catch (error) {
        res.status(404).send("user not found");
    }
})

app.patch("/update", async (req, res) => {
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

ConnectDB().then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    })
}).catch(() => {
    console.log("Database connection failed");
})

