/* eslint-disable*/
import axios from "axios";
import { showAlert } from "./alerts";
export const updateSettings = async (data, type) => {
  try {
    const url = `/api/v1/users/${type}`;
    const method = type === "forgotPassword" ? "POST" : "PATCH";
    const res = await axios({
      method,
      url,
      data
    });
    console.log(res);
    if (res.data.status === "success") {
      showAlert(
        "success",
        res.data.message ||
          `${(type = "updateMe" ? "data" : "password")} updated successfully`
      );
      window.setTimeout(() => {
        // location.reload(true);
      }, 1500);
    }
  } catch (error) {
    showAlert("error", error.response.data.message);
  }
};
