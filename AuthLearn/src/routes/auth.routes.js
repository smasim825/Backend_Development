const express = require('express')
const authController = require("../controllers/auth.controller")

const router = express.Router();

router.post("/register", authController.registerUser)

module.exports = router;



// here we just declare how the api will called
// here we dont mention the logic behind the api flow 
// for logic we have to create a seperate file 
// called Controller