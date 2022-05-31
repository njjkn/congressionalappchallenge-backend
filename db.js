const mongoose = require('mongoose')
const URL = "mongodb+srv://hanulju:Ucla757HJ@cluster0.cy49s.mongodb.net/?retryWrites=true&w=majority";

const connectDB = async () => {
    await mongoose.connect(URL, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    })
    console.log("database successfully connected")
}

module.exports = connectDB;