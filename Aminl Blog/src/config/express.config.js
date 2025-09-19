const express = require("express");
const router = require("./router.config");
const cors = require("cors");
require("./mongodb.config");
const { deleteFile } = require("../util/helper");

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
// middleware to parese x-www-urlencoded values and extended to accept nested objects
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(router);

// handler function to throw error message for non existent end points
app.use((req, res, next) => {
  next({
    code: 404,
    status: "NOT_FOUND",
    message: "Resource not found",
  });
});

// error catching middleware
app.use((err, req, res, next) => {
  // console.log('exception: ', err);
  const message = err.message || "Server Error";
  const code = err.code || 500;
  const detail = err.detail || null;
  const status = err.status || "Failed";

  // delete files if exception occurs
  if (req.file) {
    deleteFile(req.file.path);
  } else if (req.files) {
    req.files.forEach((file) => {
      deleteFile(file.path);
    });
  }

  res.status(500).json({
    message,
    error: detail,
    status,
    code,
  });
});

module.exports = app;
