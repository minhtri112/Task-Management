const express = require("express");
const database = require("./config/database");
const app = express();

require("dotenv").config();

const port = process.env.PORT;


console.log(process.env.PORT);

database.connect();



const Task = require("./models/task.model");

app.get("/tasks", async (req,res)=>{
    const task = await Task.find(
        {
            deleted : false
        }
    );
    res.json(task);
});
//jfjfjf
app.get("/tasks/detail/:id", async (req,res)=>{
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

app.listen(port ,()=>{
    console.log(`App listening on port ${port}`);
});