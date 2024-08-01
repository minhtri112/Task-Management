const User = require("../../../models/users.model");
module.exports.auth = async (req,res,next)=>{
    if(req.headers.authorization){
        const token = req.headers.authorization.split(" ")[1];
        const user = await User.findOne(
            {
                token : token
            }
        ).select("--password");

        if(user){
            req.user = user;
            next();
        }
        else{
            res.json({
                code : 400,
                token : "Token không đúng!"
            });
        }

        
    }
    else{
        res.json({
            code : 400,
            token : "Vui lòng gửi token!"
        });
    }
   
}