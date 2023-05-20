const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Middleware Alias function for getting the top 5 cheapest tours
exports.aliasTopTours = (request, response, next) => {
  request.query.limit = '5';
  request.query.sort = 'price -ratingsAverage';
  request.query.fields = 'name price ratingsAverage summary difficulty';
  next();
};

exports.getAllTours = catchAsync(async (request, response, next) => {
  // EXECUTE QUERY
  const features = new APIFeatures(Tour.find(), request.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const tours = await features.query;

  // SEND RESPONSE
  response.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours: tours,
    },
  });
});

exports.getTour = catchAsync(async (request, response, next) => {
  const tour = await Tour.findById(request.params.id);

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  response.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.createTour = catchAsync(async (request, response, next) => {
  const newTour = await Tour.create(request.body);

  response.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});

exports.updateTour = catchAsync(async (request, response, next) => {
  const tour = await Tour.findByIdAndUpdate(request.params.id, request.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  response.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.deleteTour = catchAsync(async (request, response, next) => {
  const tour = await Tour.findByIdAndDelete(request.params.id);

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  response.status(200).json({
    status: 'success',
    data: null,
  });
});

//Aggregation Pipeline matching and grouping
exports.getTourStats = catchAsync(async (request, response, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        // _id: '$ratingsAverage',
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    {
      $match: { _id: { $ne: 'EASY' } },
    },
  ]);

  response.status(400).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

//Aggregation Pipeline unwinding and projecting
exports.getMonthlyPlan = catchAsync(async (request, response, next) => {
  const year = +request.params.year;

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numToursStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $sort: { numToursStarts: -1 },
    },
    {
      $project: { _id: 0 },
    },
  ]);

  response.status(400).json({
    status: 'success',
    data: {
      plan,
    },
  });
});
