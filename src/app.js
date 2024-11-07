const express = require("express")

const app = express();

app.use("/",(req,res,next) => {
    const token = "nim";
    const isAllowed = token === "xyz";

    if(!isAllowed){
        res.status(404).send("auth error");
    }
    else{
        next();
    }
})

app.get("/user",(req,res) => {
    res.send("user found successfully");
})


// app.get("/user/ab",(req,res) => {
//     res.send("helooooo")
// })

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})