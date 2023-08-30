const News = require('../models/newsModal');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const multer = require('multer');
const sharp = require('sharp');

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image. Please upload images', 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadNewsPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `news-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(1200, 1600)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/news/${req.file.filename}`);
  next();
});

exports.getAllNews = catchAsync(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;
  // Create a query to retrieve news articles with pagination
  const query = News.find()
    .skip(skip)
    .limit(limit);
    const news = await query;
  res.status(200).json({
    status: 'success',
    results: news.length,
    data: {
      news,
    },
  });
});



exports.createOne = catchAsync(async (req, res, next) => {
  const news = await News.create(req.body);

  if (req.file) {
    news.photo = req.file.filename;
  }

  res.status(201).json({
    status: 'success',
    data: {
      news,
    },
  });
});

exports.updateOne = catchAsync(async (req, res, next) => {
  const news = await News.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!news) {
    return next(new AppError('No doc found with that ID', 404));
  }
  if (req.file) {
    news.photo = req.file.filename;
  }
  res.status(200).json({
    status: 'success',
    data: {
      news,
    },
  });
});

exports.getNews = catchAsync(async (req, res, next) => {
  const news = await News.findById(req.params.id);
  if (!news) {
    return next(new AppError('No news found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      news,
    },
  });
});

exports.deleteNews = catchAsync(async (req, res, next) => {
  const news = await News.findByIdAndDelete(req.params.id);
  if (!news) {
    return next(new AppError('No news found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: null,
  });
});
