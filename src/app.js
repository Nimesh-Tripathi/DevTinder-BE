const express = require("express")
const { ConnectDB } = require("./config/Database");
const cookieParser = require("cookie-parser")
const cors = require("cors");

const app = express();

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json())
app.use(cookieParser());

const authRouter = require("./routes/auth")
const userRouter = require("./routes/user")
const profileRouter = require("./routes/profile")
const connectionRequestRouter = require("./routes/request")

app.use("/", authRouter);
app.use("/", userRouter);
app.use("/", profileRouter);
app.use("/", connectionRequestRouter);

ConnectDB().then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    })
}).catch(() => {
    console.log("Database connection failed");
})

