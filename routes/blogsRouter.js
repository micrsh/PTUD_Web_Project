const express = require('express');
const router = express.Router();
const controller = require('../controllers/blogsController');

router.use(controller.init);

router.get('/', controller.viewList);

router.get('/:id', controller.viewDetails);

module.exports = router;  