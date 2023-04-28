/**
 * 新增文章验证规则
 */

// 导入定义验证规则的模块
const joi = require('joi');
// 定义 分类名称 和 分类别名 的校验规则
const name = joi.string().required();
const alias = joi.string().alphanum().required();

// 校验规则对象 - 添加分类
exports.add_cate_schema = {
    body:{
        name,
        alias,
    },
}

// 定义删除文章 id 的校验规则
const id = joi.number().integer().min(1).required();
exports.delete_cate_schema = {
    params:{
        id,
    }
}
// 定义根据 id 查找指定文章分类的数据 
exports.get_cate_schema = {
    params:{
        id,
    }
}

// 定义根据 id 更新指定的文章分类数据
exports.updata_cate_schema= {
    body:{
        Id:id,
        name,
        alias
    },
}