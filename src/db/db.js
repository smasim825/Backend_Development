const mongoose = require("mongoose");

async function connectDB() {
   await mongoose.connect("mongodb+srv://asim:9dLtn-_N!mHQE.-@praccluster0.bzlfuq6.mongodb.net/DoraemonPocket")

   console.log("database connect with server")
}

module.exports = connectDB