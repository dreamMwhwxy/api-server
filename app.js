// 导入 express 模块
const express = require('express')
// 创建 express 的服务器实例
const app = express()
// 导入 cors 跨域请求中间件
const cors = require("cors");
// 导入验证规则
const joi = require("@hapi/joi");
//将cors 设置为全局中间件
app.use(cors());


// 解析表单数据的中间件 application/x-www-form-urlencoded 解析表格的中间件
app.use(express.urlencoded({ extended: false }));

// 返回错误信息全局中间件--- 给res挂载 cc()方法
app.use(function (req, res, next) {
    res.cc = function (err, status = 1) {
        res.send({
            // 状态
            status,
            message: err instanceof Error ? err.message : err
        });
    }
    next();
});

// 必须在路由之前导入解析 token 的模块
// 解析 token 的中间件
const expressJwt = require("express-jwt");
// 导入配置文件
const config = require("./config");
// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
app.use(expressJwt({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }))


// 导入用户路由模块
const userRouter = require("./router/user");
app.use("/api", userRouter);  // 每一个访问user前都要加上 api路径
const userinfoRouter = require("./router/userinfo");
app.use("/my",userinfoRouter);
// 导入获取文章路由模块
const artCateRouter = require('./router/artcate');
// 为文章的路由挂载统一的访问前缀 /my/article
app.use('/my/article',artCateRouter);
// 导入并使用文章路由模块
const articleRouter = require('./router/article');
// 为文章的路由挂载统一的访问前缀 /my/article
app.use('/my/article', articleRouter);

// 托管静态资源文件
app.use('/uploads', express.static('./uploads'))


//  错误中间件
app.use(function (err, req, res, next) {
    // (用户名或密码)数据验证失败
    if (err instanceof joi.ValidationError) {
        return res.cc(err)
    }
    // 捕获身份认证(token)失败的错误
    if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
    // 未知错误
    res.cc(err);
})

// 调用 app.listen 方法，指定端口号并启动web服务器
app.listen(3007, function () {
    console.log('api server running at http://127.0.0.1:3007')
})
