require('dotenv').config();
const app = require("./src/app");
const connectDB = require("./src/db/db")
app.listen(8000, () => {
    console.log("server is running on port 8000")
})

connectDB();