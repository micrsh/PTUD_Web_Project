const controller = {};
const { query } = require('express');
const models = require('../models');
const { where } = require('sequelize');
const sequelize = require('sequelize');
const Op = sequelize.Op;

controller.init = async (req, res, next) => {
    // Lấy danh sách categories đưa ra view
    let categories = await models.Category.findAll({
        include:[{model: models.Blog}]
    });
    res.locals.categories = categories;
   
    // Lấy danh sách tags
    let tags = await models.Tag.findAll();
    res.locals.tags = tags;

    next();
}

controller.viewList = async (req,res) => {
    let categoryId = isNaN(req.query.category) ? 0 : parseInt(req.query.category);
    let tagId = isNaN(req.query.tag) ? 0 : parseInt(req.query.tag);
    let keyword = req.query.keyword ? req.query.keyword.trim() : "";

    // Lấy danh sách Blogs theo Category
    let options = {
        attributes: ["id", "title", "imagePath", "summary", "createdAt"],
        include: [{model: models.Comment}],
        where: {}
    }

    if(categoryId > 0) {
       options.where.categoryId = categoryId;
    }

    if(tagId > 0){
        options.include.push({model: models.Tag, where: {id: tagId}});
    }

    if(keyword != ''){
        options.where.title = {[Op.iLike]: `%${keyword}%`};
    }

    let blogs = await models.Blog.findAll(options);
    // Pagination
    let limit = 2;
    let page = isNaN(req.query.page) ? 1 : parseInt(req.query.page); 
    let offset = (page - 1)*limit;
    let selectedBlogs = blogs.slice(offset, offset + limit);
   
    let pagination = {
        page,
        limit,
        totalRows: blogs.length
    };

    res.locals.pagination = pagination;
    res.locals.blogs = selectedBlogs;
    res.render('index');
};

controller.viewDetails = async (req,res) => {
    let id = isNaN(req.params.id) ? 0: parseInt(req.params.id);
    let blog = await models.Blog.findOne({
        where: {id},
        include: [{model: models.User},{model: models.Category},{model: models.Tag}]
    });
    res.locals.blog = blog;
    res.render('details');
}

module.exports = controller