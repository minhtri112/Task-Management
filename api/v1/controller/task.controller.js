const Task = require("../../../models/task.model");
const paginationHelper = require("../../../helpers/pagination");
const searchHelper = require("../../../helpers/search");

// [GET] /api/v1/tasks
module.exports.index = async (req, res) => {
    const find = {
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
        res.join("Không tìm thấy");
    }
}