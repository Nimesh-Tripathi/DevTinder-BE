const jwt = require("jsonwebtoken")
const User = require("../models/user")

const userAuth = async (req, res, next) => {

    try {
        const cookies = req.cookies;

        const { token } = cookies;

        const message = await jwt.verify(token, "Nimesh");

        const { _id } = message;

        const user = await User.findById(_id);

        req.user = user;
        next();
    } catch (error) {
        res.status(401).send("Error : " + error.message);
    }
}

module.exports = { userAuth }