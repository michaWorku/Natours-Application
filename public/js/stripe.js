/* eslint-disable */
import axios from "axios";

import { showAlert } from "./alerts";
const stripe = Stripe("sk_test_51K09Y6DH2tNBqogEOHFm86sQZ7Ej1qKKtMIEkCPTbVj2Lwo0HkRPz7axBoxkWIUu2GKhqQcl2IgDfWL72w6rCGfk00dnIfrmXu");

export const bookTour = async tourId => {
  try {
    // 1) Get checkout session from API
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
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
