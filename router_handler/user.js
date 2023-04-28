/**
 * 抽离用户路由模块中的处理函数
 * 在这里定义和用户相关的路由处理函数，供 /router/user.js 模块进行调用
 */


// 导入数据库模块
const db = require('../db/index');
// 导入密码加密包
const bcrypt = require('bcryptjs');
// 用这个包来生成 Token 字符串
const jwt = require('jsonwebtoken');
// 导入全局的配置的文件
const config = require("../config");


// 注册用户的处理函数
exports.regUser = (req, res) => {
    // 获取用户表单里面的数据
    const userinfo = req.body;
    // 判断用户名或者密码是否合法
    // if (!userinfo.username || !userinfo.password) {
    //     // return res.send({ status: 1, message: "用户名或密码不能为空!" })
    //     // 优化后的在app中添加的全局中间件
    //     return res.cc("用户名或密码不能为空!");
    // }

    // 定义 sql 语句判断用户是否被占用
    const sqlstr = `select * from ev_users where username=?`;
    db.query(sqlstr, [userinfo.username], function (err, results) {
        // 执行 sql 语句失败
        if (err) {
            // return res.send({ status: 1, message: err.message })
            return res.cc(err);
        }
        // 用户名被占用
        if (results.length > 0) {
            // return res.send({ status: 1, message: '用户名被占用，请更换其他用户名！' })
            return res.cc('用户名被占用，请更换其他用户名！');
        }
        // 对用户密码进行加密 返回值是返回值是加密之后的密码字符串
        userinfo.password = bcrypt.hashSync(userinfo.password, 10);
        // 定义注册的 sql 语句
        const sql = `insert into ev_users set ?`;
        // 调用db.query()执行 sql 语句
        db.query(sql, { username: userinfo.username, password: userinfo.password }, function (err, results) {
            if (err) {
                // return res.send({status:1,message:err.message})
                return res.cc(err);
            }
            if (results.affectedRows !== 1) {
                // return res.send({status:1,message:'注册失败，请示后再试！'})
                return res.cc('注册失败，请示后再试！')
            }
            // res.send({status:0,message:'注册成功！'})
            res.cc('注册成功！', 0);
        });
    });
};

// 注册用户登入的处理函数
exports.login = (req, res) => {
    // res.send("login ok!")
    // 接收表单数据
    const userinfo = req.body;
    // 定义sql语句
    const sql = `select * from ev_users where username=?`;
    // 执行sql
    db.query(sql, userinfo.username, function (err, results) {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)
        // 执行 SQL 语句成功，但是查询到数据条数不等于 1
        if (results.length !== 1) return res.cc('登录失败！')
        // 拿着用户输入的密码,和数据库中存储的密码进行对比 返回值为布尔值
        // TODO: 判断用户密码是否正确
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password);
        if (!compareResult) {
            return res.cc("登入失败！");
        }
        // TODO: 在服务器端生成token 字段
        // 剔除(密码和头像)完毕之后，user 中只保留了用户的 id, username, nickname, email 这四个属性的值----es6新语法
        const user = { ...results[0], password: '', user_pic: '' };
        // 生成 Token 加密后的字符串
        const tokenStr = jwt.sign(user, config.jwtSecretKey, {
            expiresIn: '10h' // token有效时间为10小时
        });
        res.send({
            status:0,
            message:'登入成功！',
            token: 'Bearer ' + tokenStr,
        });
    })
};
