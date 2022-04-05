const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Catching Uncaught Exception
process.on("uncaughtException", err => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down... ");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });
const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

// const DB_LOCAL = process.env.DATABASE_LOCAL;
//const DB_LOCAL = "mongodb://localhost:27017/natours";
mongoose
  .connect(DB, {
    useNewUrlParser: true
  })
  .then(() => console.log("DB connection successfull!"))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`listen to port ${PORT}`);
});

// Handling Unhandled Rejection
process.on("unhandledRejection", err => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});
