//TOUR ROUTERS
const fs = require('fs');
const authController = require('../controllers/authController');

const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
  getToursWithin,
  getDistances,
} = require('../controllers/tourController');
const reviewRouter = require('./reviewRoutes');
const express = require('express');

const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

//Examples of aliasing
router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

// Routes that practice using agggregate pipelin
router.route('/tour-stats').get(getTourStats);
router
  .route('/monthly-plan/:year')
  .get(authController.protect, authController.restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan, getTourStats);

router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(getToursWithin);
router.route('/distances/:latlng/unit/:unit').get(getDistances);

router
  .route('/')
  .get(getAllTours)
  .post(authController.protect, authController.restrictTo('admin', 'lead-guide'), createTour);
router
  .route('/:id')
  .get(getTour)
  .patch(authController.protect, authController.restrictTo('admin', 'lead-guide'), updateTour)
  .delete(authController.protect, authController.restrictTo('admin', 'lead-guide'), deleteTour);

// router
//   .route('/:tourId/reviews')
//   .post(authController.protect, authController.restrictTo('admin', 'user'), reviewController.createReview);

module.exports = router;
