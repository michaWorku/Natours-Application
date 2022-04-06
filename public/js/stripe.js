/* eslint-disable */
import axios from "axios";

import { showAlert } from "./alerts";
const stripe = Stripe("pk_test_51K09Y6DH2tNBqogE1C7sxCHNSBXVJ22ysQiWLpvFg4cW9shgMLV2S7NjL76Uar2VP5Nimc0JZamcol7YTZSUV4rC00205P0Lhi");

export const bookTour = async tourId => {
  try {
    // 1) Get checkout session from API
    const session = await axios(
      `/api/v1/bookings/checkout-session/${tourId}`
    );
    console.log(session);

    // 2) Crate checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (error) {
    console.log(err);
    showAlert("error", err);
  }
};
