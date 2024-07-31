const Task = require("../../../models/task.model");


// [GET] /api/v1/tasks
module.exports.index = async (req,res)=>{
    const find = {
        deleted : false,
    }

    if(req.query.status){
        find.status = req.query.status;
    }

    // Sort
    const sort = {};
    if(req.query.keyValue && req.query.sortKey){
        sort[req.query.sortKey] = req.query.keyValue;
    }
    // End Sort

    
    const task = await Task.find(find).sort(sort);
    res.json(task);
}

// [GET] /api/v1/tasks/:id
module.exports.detail = async (req,res)=>{
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
}