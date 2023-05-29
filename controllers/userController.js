const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

//////////////////////////////////
/////USER UPDATES THEIR DATA
//////////////////////////////////

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1. Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfrim) {
    return next(new AppError('This route is not for password updates. Please use/ updateMyPassword', 400));
  }

  // Filterted out names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');

  // 2) Update user dcoument
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, { new: true, runValidators: true });

  res.status(200).json({
    status: 'status',
    data: {
      user: updatedUser,
    },
  });
});

//////////////////////////////////
/////USER SETS ACCOUNT TO INACTIVE
//////////////////////////////////

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

//////////////////////////////////
/////USER GETS THEIR INFO
//////////////////////////////////
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.getUser = factory.getOne(User, 'user');
exports.getAllUsers = factory.getAll(User, 'users');
//////////////////////////////////
/////FOR ADMIN USE ONLY, UPDATE AND DELETE
//////////////////////////////////
exports.updateUser = factory.updateOne(User, 'user');
exports.deleteUser = factory.deleteOne(User);

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined! Please use /signup instead!',
  });
};
