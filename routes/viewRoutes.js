const express = require('express');
const authController = require('../controllers/authController');
const {
  getOverview,
  getTour,
  getLoginForm,
  getAccount,
  updateUserData,
  getSignupForm,
  getMyTours,
} = require('../controllers/viewController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.get('/', bookingController.createBookingCheckout, authController.isLoggedIn, getOverview);
router.get('/tour/:slug', authController.isLoggedIn, getTour);
router.get('/login', authController.isLoggedIn, getLoginForm);
router.get('/signup', getSignupForm);
router.get('/me', authController.protect, getAccount);
router.get('/my-tours', authController.protect, getMyTours);

router.post('/submit-user-data', authController.protect, updateUserData);

module.exports = router;
