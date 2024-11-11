const { mongoose } = require("mongoose")

const ConnectDB = async() => {
    await mongoose.connect("mongodb+srv://nimeshtripathi2004:iTKQGM250gdMXdVn@cluster0.8anuo.mongodb.net/devTinder");
}

module.exports = { ConnectDB }