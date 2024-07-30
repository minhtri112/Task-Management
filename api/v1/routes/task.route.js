const express = require('express');
const Task = require("../../../models/task.model");

const router = express.Router();


router.get("/", async (req,res)=>{
    const task = await Task.find(
        {
            deleted : false
        }
    );
    res.json(task);
});
router.get("/detail/:id", async (req,res)=>{
    try{
        const id = req.params.id;
        const task = await Task.find(
            {
                _id : id,
                deleted : false,
            }
        );
        res.json(task);
    }
    catch{
        res.join("Không tìm thấy");
    }
})

module.exports = router; // export router