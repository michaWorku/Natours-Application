const Tour = require("../models/tourModel");
const User = require("../models/userModel");
const Booking = require("../models/bookingModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get Tour data from collections
  const tours = await Tour.find();

  // 2) Build Template
  // 3) Render template using tour data
  res.status(200).render("overview", {
    title: "All Tour",
    tours
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1) Get the data, for the requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    fields: "review rating user"
  });

  // Handling error
  if (!tour) return next(new AppError("There is no tour with that name.", 404));

  // 2) Build Template
  // 3) Render template using tour data
  res.status(200).render("tour", {
    title: `${tour.name} Tour`,
    tour
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render("login", {
    title: "Log into your account"
  });
};

exports.getSignupForm = (req, res) => {
  res.status(200).render("signup", {
    title: "Sign up your account"
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render("account", {
    title: "Your account"
  });
};

exports.getForgetPasswordForm = (req, res) => {
  res.status(200).render("forgotPassword", {
    title: "Forgot your password"
  });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  // 2) Find tours with the returned IDS
  const tourIDS = bookings.map(el => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDS } });

  res.status(200).render("overview", {
    title: "My Tours",
    tours
  });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updateUser = await User.findByIdAndUpdate(
    req.user.id,
    { name: req.body.name, email: req.body.email },
    {
      new: true,
      runValidators: true
    }
  );
  res.status(200).render("account", {
    title: "Your account",
    user: updateUser
  });
});
