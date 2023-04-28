/**
 * 获取文章的路由模块
 */
// 导入 express
const express = require('express');
// 创建路由模块
const router = express.Router();
// 导入文章路由处理函数
const artcate_handler = require('../router_handler/artcate');
// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi');
// 导入文章的验证模块
const {add_cate_schema,delete_cate_schema,get_cate_schema,updata_cate_schema} = require('../schema/artcate');
// 获取文章分类列表
router.get('/cates',artcate_handler.getArtCates);
// 新增文章分类
router.post('/addcates',expressJoi(add_cate_schema),artcate_handler.addArticleCate);
// 根据 id 删除指定的文章
router.get('/deletecate/:id',expressJoi(delete_cate_schema),artcate_handler.deleteCateById);
// 根据 Id 获取文章分类数据
router.get('/cates/:id',expressJoi(get_cate_schema),artcate_handler.getArtCateById);
// 根据 id 更新文章分类数据
router.post('/updatecate',expressJoi(updata_cate_schema),artcate_handler.updateCateById);


// 向外共享路由模块
module.exports = router;