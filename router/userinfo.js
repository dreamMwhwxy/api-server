/**
 * 获取、更新用户的基本信息
 */
const express = require("express");
const router = express.Router();
// 加载用户数据路由处理函数
const userinfo_handler = require('../router_handler/userinfo');
// 获取用户的基本信息 
router.get('/userinfo',userinfo_handler.getuserInfo);

// 更新用户的基本信息
// 导入验证数据合法性的中间件
const expressJoi = require("@escook/express-joi");
// 导入需要的验证规则对象
const {updata_userinfo_schema,update_password_schema,updata_avatar_schema} = require("../schema/user");
// 更新用户的基本信息
router.post('/userinfo',expressJoi(updata_userinfo_schema),userinfo_handler.updateuserInfo);
// 更新用户密码的路由
router.post('/updatepwd',expressJoi(update_password_schema),userinfo_handler.updatePassword);
// 更新用户头像的路由
router.post('/update/avatar', expressJoi(updata_avatar_schema),userinfo_handler.updateAvatar)



module.exports = router
