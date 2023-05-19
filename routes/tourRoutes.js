//TOUR ROUTERS
const fs = require('fs');

const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
} = require('../controllers/tourController');
const express = require('express');

const router = express.Router();

// router.param('id', checkID);

//Examples of aliasing
router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

// Routes that practice using agggregate pipelin
router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan, getTourStats);

router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
