const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

///////////////////////////////////
/////DELETE A DOCUMENT FROM MONGODB
///////////////////////////////////
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

///////////////////////////////////
/////UPDATE A DOCUMENT IN MONGODB
///////////////////////////////////
exports.updateOne = (Model, type) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError(`No ${type} found with that ID`, 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        [type]: doc,
      },
    });
  });

///////////////////////////////////
/////CREATE A DOCUMENT IN MONGODB
///////////////////////////////////
exports.createOne = (Model, type) =>
  catchAsync(async (req, res, next) => {
    const newDoc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        [type]: newDoc,
      },
    });
  });

///////////////////////////////////
/////GET/READ A DOCUMENT IN MONGODB
///////////////////////////////////
exports.getOne = (Model, type, popOptions) =>
  catchAsync(async (request, response, next) => {
    let query = Model.findById(request.params.id);
    if (popOptions) query = query.populate(popOptions);

    const doc = await query;

    if (!doc) {
      return next(new AppError(`No ${type} found with that ID`, 404));
    }

    response.status(200).json({
      status: 'success',
      data: {
        [type]: doc,
      },
    });
  });

exports.getAll = (Model, type) =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on tour
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    // EXECUTE QUERY
    const features = new APIFeatures(Model.find(filter), req.query).filter().sort().limitFields().paginate();

    const docs = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: {
        [type]: docs,
      },
    });
  });
