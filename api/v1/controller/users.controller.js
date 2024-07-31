const md5 = require("md5");
const User = require("../../../models/users.model");
// [GET] /api/v1/users/register
module.exports.register = async (req, res) => {
    req.body.password = md5(req.body.password);

    const exitsEmail = await User.findOne(
        {
            deleted : false,
            email : req.body.email
        }
    );

    if(exitsEmail){
        res.json(
            {
                code : 400,
                message : "Email đã tồn tại!"
            }
        )
    }
    else{
        const user = new User(req.body);
        await user.save();
        res.cookie("token",user.token);
        res.json(
            {
                code : 200,
                message : "Đăng kí thành công!",
                token : user.token
            }
        )
    }
}