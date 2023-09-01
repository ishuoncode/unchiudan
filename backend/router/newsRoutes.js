const express = require('express');
const newsController = require('./../controllers/newsController');
const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(newsController.getAllNews)
  .post(
    protect,
    restrictTo('admin'),
    newsController.uploadPhoto,
    newsController.resizePhoto("public/img/news"),
    newsController.createOne,
  );

router
  .route('/autodelete')
  .delete(protect, restrictTo('admin'), newsController.autoDelete);

router
  .route('/:id')
  .get(newsController.getNews)
  .delete(protect, restrictTo('admin'), newsController.deleteNews)
  .patch(
    protect,
    // restrictTo('admin'),
    newsController.uploadPhoto,
    newsController.resizePhoto("public/img/news"),
    newsController.updateOne,
  );

module.exports = router;