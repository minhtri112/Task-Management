const express = require('express');


const router = express.Router();

const controller = require("../controller/users.controller");
const authMiddleware = require("../middlewares/auth.middlewares");


router.post("/register", controller.register);

router.post("/login", controller.login);

router.post("/password/forgot", controller.forgotPassword);

router.post("/password/otp", controller.otpPassword);

router.post("/password/reset", controller.resetPassword);

router.get("/detail",authMiddleware.auth, controller.detail);

router.get("/list",authMiddleware.auth, controller.list);


module.exports = router; // export router