const express = require('express');


const router = express.Router();

const controller = require("../controller/task.controller");


router.get("/", controller.index);

router.get("/detail/:id", controller.detail)

router.patch("/change-status/:id", controller.changStatus);

router.patch("/change-multi", controller.changMulti);

module.exports = router; // export router