/* eslint-disable*/
import "@babel/polyfill";
import { displayMap } from "./mapBox";
import { login, logout } from "./login.js";
import { updateSettings } from "./updateSettings";
import { signup } from "./signup";
import { bookTour } from "./stripe";
import { showAlert } from './alerts'

// DOM ELEMENTS
const mapBox = document.getElementById("map");
const loginForm = document.querySelector(".form--login");
const logoutBtn = document.querySelector(".nav__el--logout");
const userDataForm = document.querySelector(".form-user-data");
const userPasswordForm = document.querySelector(".form-user-password");
const singupForm = document.querySelector(".form--signup");
const forgotPasswordForm = document.querySelector(".form--forgot-password");
const bookTourBtn = document.getElementById("book-tour");

//DELEGATION
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener("submit", e => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    console.log({ email, password });
    login(email, password);
  });
}

if (logoutBtn) logoutBtn.addEventListener("click", logout);

if (userDataForm) {
  userDataForm.addEventListener("submit", e => {
    e.preventDefault();
    const form = new FormData();
    form.append("name", document.getElementById("name").value);
    form.append("email", document.getElementById("email").value);
    form.append("photo", document.getElementById("photo").files[0]);

    updateSettings(form, "updateMe");
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener("submit", async e => {
    e.preventDefault();
    document.querySelector(".btn--save-password").textContent = "Updating...";
    const passwordCurrent = document.getElementById("password-current").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;
    console.log({ passwordCurrent });
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      "updateMyPassword"
    );
    document.querySelector(".btn--save-password").textContent = "save password";
    document.getElementById("password-current").value = "";
    document.getElementById("password").value = "";
    document.getElementById("password-confirm").value;
  });
}

if (singupForm) {
  singupForm.addEventListener("submit", async e => {
    e.preventDefault();
    const form = new FormData();
    const name = document.getElementById("name").value;
    const role = document.getElementById("role").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;

    await signup({ name, role, email, password, passwordConfirm });

    document.getElementById("name").value = "";
    document.getElementById("role").value = "";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    document.getElementById("password-confirm").value = "";
  });
}

if (forgotPasswordForm) {
  forgotPasswordForm.addEventListener("submit", async e => {
    e.preventDefault();
    document.querySelector(".btn--reset-password").textContent = "Resetting...";
    const email = document.getElementById("email").value;
    console.log({ email });
    await updateSettings({ email }, "forgotPassword");
    document.querySelector(".btn--forgot-password").textContent =
      "reset password";

    document.getElementById("email").value = "";
  });
}

if (bookTourBtn) {
  bookTourBtn.addEventListener("click", (e) => {
    console.log('clickd')
    // Changing text
    e.target.innerHTML = "Processing...";
    // destructuring, otherwise do dataset.tourId. Even the getAttribute function works as used above for locations.
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}

const messageAlert = document.querySelector("body").getAttribute("data-alert");

if (messageAlert) {
  showAlert("success", messageAlert, 12);
}
