// ALWAYS RE-BUILD THE PARCEL BUNDLE, EVERYTIME YOU MAKE CHANGES IN THE FRONT-END.
const Tour = require("../models/tourModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const Booking = require("../models/bookingModel");

exports.setSecurityPolicy = (_, res, next) => {
  res.set(
    'Content-Security-Policy',
    "default-src 'self' https://*.mapbox.com https://*.stripe.com/v3/ ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com https://js.stripe.com/v3/ 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
  );
  next();
};

exports.getOverview = catchAsync(async (req, res, next) => {
  // It searches in the view folder as we have specified on line 39 and knows its pug as we have specified the view engine.

  // 1. Get tour data from collection
  const tours = await Tour.find({});
  // 2. Build template
  // 3. Render the website from the data received from step 1
  res
    .status(200)
    .set(
      "Content-Security-Policy",
      "default-src 'self' stripe.com *.stripe.com *.googleapis.com googleapis.com *.gstatic.com gstatic.com; font-src *.googleapis.com googleapis.com *.gstatic.com gstatic.com; style-src 'self' https: 'unsafe-inline';upgrade-insecure-reqs;"
    )
    .render("overview", {
      title: "Exciting Tours for adventurous people!",
      tours
    });
  // This data is called locals in the pug file
});

exports.getTour = catchAsync(async (req, res, next) => {
  // Retreiving the slug
  const { slug } = req.params;
  const tour = await Tour.findOne({ slug: slug }).populate({
    path: "reviews",
    fields: "review rating user",
  });

  if (!tour) {
    return next(new AppError("No tour found by that name", 404));
  }

  res
    .status(200)
    .render("tour", {
      title: `${tour.name} Tour`,
      tour,
    });
});

exports.getLoginForm = catchAsync(async (req, res, next) => {
  if (!res.locals.user) {
    res.status(200).render("login", {
      title: "Log Into your account",
    });
  } else {
    res.redirect("/");
  }
});

exports.getSignUpForm = catchAsync(async (req, res, next) => {
  if (!res.locals.user) {
    res.status(200).render("signup", {
      title: "Sign Up for an account",
    });
  } else {
    res.redirect("/");
  }
});

exports.getAccount = catchAsync(async (req, res) => {
  // We don't query for current user as its already been done in the protect middleware.
  if (res.locals.user) {
    res.status(200).render("account", {
      title: "Your Account",
    });
  } else {
    res.redirect("/");
  }
});

exports.getForgetPasswordForm = (req, res) => {
  // We don't query for current user as its already been done in the protect middleware.
  if (res.locals.user) {
    res.status(200).render("forgotPassword", {
      title: "Forgot your password"
    });
  } else {
    res.redirect("/");
  }
 
};

exports.updateUserData = catchAsync(async (req, res) => {
  // A req is sent with the body to the specified URL and gets called here. Now req.body won't work as we have to parse data coming from a form using URLEncoded.
  // console.log(req.body);

  // req.user.id works, res.locals.user.id also works as we have specified both in our protect middleware.
  const updatedUser = await User.findByIdAndUpdate(
    res.locals.user.id,
    {
      // We gave them these names in the HTML form. Only name and email must be updated.
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  // Anything other than email and name is stripped away from the body for security. Hence we execute the above code to prevent any additional fields being passed.(using inspect element, adding new fields lol.)
  // Never update password like this as we must run the save middleware and encrypt our password.

  res.status(200).render("account", {
    title: "Your Account",
    // the old(before update) user in the account pug template comes from locals which comes from the protect middleware, hence it won't change until we log in again. To make it instant, we specify the updatedUser so that the account pug template uses this.
    user: updatedUser,
  });
});
// I think the data passed in the event handler holds more priority than the locals object.

exports.getMyTours = catchAsync(async (req, res, next) => {
  ////////////////// WE COULD ALSO USE VIRTUAL POPULATE ////////////////////
  // 1. Find the bookings wrt user ID.
  const bookings = await Booking.find({ user: req.user.id });

  // 2. Creating an array of toursID's and query for their respective tours.
  const tourIds = bookings.map((el) => el.tour);
  // Method 2a.
  // const bookedTours = await Promise.all(
  //   tourIds.map(async (tourId) => await Tour.findById(tourId))
  // );

  // Method 2b. in is a mongodb operator. tours in the tourIds array.
  // 3.Find the tours related with that booking using the returned ids.
  const bookedTours = await Tour.find({ _id: { $in: tourIds } });

  if (bookedTours.length === 0) {
    return res.status(404).render("error", {
      message: "You have no booked tours!",
    });
  }

  return res
    .status(200)
    .render("overview", {
      title: "Your Booked Tours",
      tours: bookedTours
    });
});

exports.alerts = (req, res, next) => {
  const { alert } = req.query;

  // In the stripe docs, it mentions that sometimes the webhook is called a little after the success url is called.
  if (alert === "booking") {
    res.locals.alert =
      "Your booking was successful. Please check your email for a confirmation and more information. \n\t If your booking doesn't show up here immediately, please check back later.";
  }
  next();
};