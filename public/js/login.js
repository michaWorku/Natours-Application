/* eslint-disable*/
import axios from "axios";
import { showAlert } from "./alerts";

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/users/login",
      data: {
        email,
        password
      },
      withCredentials: true,
    });

    console.log(res);

    if (res.data.status === "success") {
      showAlert("success", "Logged in successfully!");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
    console.log(res);
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "/api/v1/users/logout",
      withCredentials: true,
    });
    if (res.data.status === "success") {
      location.reload(true);
      location.assign("/");
    }
  } catch (err) {
    showAlert("error", "Error logging out! Try again.'");
  }
};
