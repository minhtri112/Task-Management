const express = require('express');


const router = express.Router();

const controller = require("../controller/users.controller");


router.get("/register", controller.register);

module.exports = router; // export router