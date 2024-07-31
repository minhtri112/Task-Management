const express = require('express');


const router = express.Router();

const controller = require("../controller/users.controller");


router.post("/register", controller.register);

router.post("/login", controller.login);

module.exports = router; // export router