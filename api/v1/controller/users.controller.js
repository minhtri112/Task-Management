const md5 = require("md5");
const User = require("../../../models/users.model");
const ForgotPassword = require("../../../models/forgot-password.model");
const generate = require("../../../helpers/generate");
const sendMailHelper = require("../../../helpers/sendMail");
// [POST] /api/v1/users/register
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
        const user = new User({
            email : req.body.email,
            fullName : req.body.fullName,
            password : req.body.password,
            token : generate.generateRandomString(20)
        });
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


// [POST] /api/v1/users/login
module.exports.login = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({
        deleted : false,
        email : email,
        password : md5(password)
    });

    if(!user){
        res.json(
            {
                code : 400,
                message : "Email hoặc Password sai!",
            }
        )
        return;
    }

    res.cookie("token",user.token);

    res.json(
        {
            code : 200,
            message : "Đăng nhập thành công!",
            token : user.token
        }
    )
}

// [POST] /api/v1/users/password/forgot
module.exports.forgotPassword = async (req, res) => {
    const email = req.body.email;

    const user = await User.findOne({
        deleted : false,
        email : email 
    });

    if(!user){
        res.json({
            code : 400,
            massage : "Email không tồn tại!"
        })
        return;
    }

    // Lưu về database
    const otp = generate.generateRandomNumber(4);
    const timeExpire = 5;
    
    const objectForgotPassword = {
        email : email,
        otp : otp,
        expireAt : Date() + timeExpire*60*1000
    };

    const forgotPassword = new ForgotPassword(objectForgotPassword);
    forgotPassword.save();

    // Gửi email
    const subject = "Mã OTP xác minh lấy lại mật khẩu";
    const html = `
      Mã OTP xác min lấy lại mật khẩu là ${otp}. Thời hạn sử dụng là 5 phút.
      Lưu ý không được lộ OTP
    `
    sendMailHelper.sendMail(email,subject,html);

    res.json({
        code : 200,
        massage : "Đã gửi email!"
    })

    
}


// [POST] /api/v1/users/password/otp
module.exports.otpPassword = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;

    const checkOTP = await ForgotPassword.findOne({
        email : email,
        otp : otp
    });

    console.log(checkOTP);

    if(!checkOTP){
        res.json(
            {
                code : 400,
                message : "OTP không chính xác!",
            }
        )
        return;
    };


    const user = await User.findOne({
        deleted : false,
        email : email
    });

    res.cookie("token",user.token);

    res.json(
        {
            code : 200,
            message : "Đăng nhập thành công!",
            token : user.token
        }
    )
}


// [POST] /api/v1/users/password/reset
module.exports.resetPassword = async (req, res) => {
    const password = req.body.password;
    const token = req.body.token;

    const user = await User.findOne(
        {
            token : token,
        }
    );

    if(!user){
        res.json(
            {
                code : 400,
                message : "Token không chính xác!",
            }
        )
        return;
    }

    if(md5(password) == user.password){
        res.json(
            {
                code : 400,
                message : "Trùng mật khẩu cũ!",
            }
        )
        return;
    }


    await User.updateOne(
        {
            token : token
        },
        {
            password : md5(password)
        }
    );


    res.json(
        {
            code : 200,
            message : "Cập nhật thành công!",
        }
    )
}


// [GET] /api/v1/users/detail
module.exports.detail = async (req, res) => {
    res.json(
        {
            code : 200,
            message : "Thành công!",
            data : req.user
        }
    )
}

// [GET] /api/v1/users/list
module.exports.list = async (req, res) => {
    const listUser = await User.findOne(
        {
            deleted : false,
            _id : {$ne : req.user.id}
        }
    ).select("fullName token email");
    res.json({
        code : 200,
        message : "Thành công",
        data : listUser
    })
}