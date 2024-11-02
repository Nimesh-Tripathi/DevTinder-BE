const express = require("express")

const app = express();

app.use("/login",(req,res) => {
    res.send("heloooo");
})

app.listen(3000,() => {
    console.log("Server is running on port 3000");
})