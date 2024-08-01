const Task = require("../../../models/task.model");
const paginationHelper = require("../../../helpers/pagination");
const searchHelper = require("../../../helpers/search");

// [GET] /api/v1/tasks
module.exports.index = async (req, res) => {
    const find = {
        $or : [
            {createdBy: req.user.id},
            {listUser : req.user.id}
        ],
        deleted: false,
    }

    if (req.query.status) {
        find.status = req.query.status;
    }

    // Search
    const objectSearch = searchHelper(req.query);
    if (objectSearch.regex) {
        find.title = objectSearch.regex;
    }
    // End Search

    // Pagination
    const countTask = await Task.countDocuments(find);

    let objectPagination = paginationHelper(
        {
            currentPage: 1,
            litmitItems: 2
        },
        req.query, countTask
    )

    // End Pagination

    // Sort
    const sort = {};
    if (req.query.keyValue && req.query.sortKey) {
        sort[req.query.sortKey] = req.query.keyValue;
    }
    // End Sort

    const task = await Task.find(find).sort(sort).skip(objectPagination.skip).limit(objectPagination.litmitItems);
    res.json(task);
}

// [GET] /api/v1/tasks/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;
        const task = await Task.find(
            {
                _id: id,
                deleted: false,
            }
        );
        res.json(task);
    }
    catch {
        res.json("Không tìm thấy");
    }
}

// [PATCH] /api/v1/tasks/change-status/:id
module.exports.changStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const status = req.body.status;
    
        await Task.updateOne(
            {_id : id},
            {status : status}
        );
        res.json({
            code: 200,
            message: "Cập nhật trạng thái thành công!"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Cập nhật trạng thái không thành công!"
        });
    }
}

// [PATCH] /api/v1/tasks/change-multi
module.exports.changMulti = async (req, res) => {
    try {
        const {ids,key,value} = req.body;

        switch (key) {
            case "status":
                await Task.updateMany({
                    _id : {$in : ids},
                },{status : value});
                break;
            case "deleted":
                await Task.updateMany({
                    _id : {$in : ids},
                },{
                    deleted : true,
                    deletedAt : new Date()
                });
                break;
        
            default:
                res.json({
                    code: 400,
                    message: "Không tồn tại!"
                });
                break;
        }

        res.json({
            code: 200,
            message: "Cập nhật trạng thái thành công!"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Cập nhật trạng thái không thành công!"
        });
    }
}


// [POST] /api/v1/tasks/create
module.exports.create = async (req, res) => {
    try {
        req.body.createdBy = req.user.id;

        const task = new Task(req.body);
        const data  = await task.save();

        
        res.json({
            code: 200,
            message: "Thêm sản phẩm thành công!",
            data : data
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Thêm sản phẩm không thành công!"
        });
    }
}


// [PATCH] /api/v1/tasks/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Task.updateOne(
            {_id : id},
            req.body
        );
        res.json({
            code: 200,
            message: "Cập nhật sản phẩm thành công!",
            data : data
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Cập nhật không sản phẩm thành công!",
        });
    }
}

// [DELETE] /api/v1/tasks/delete/:id
module.exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Task.updateOne(
            {_id : id},
            {
                deleted : true,
                deletedAt : new Date()
            }
        );
        res.json({
            code: 200,
            message: "Xóa sản phẩm thành công!",
            data : data
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Xóa không sản phẩm thành công!",
        });
    }
}