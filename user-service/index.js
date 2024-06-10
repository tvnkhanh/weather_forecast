require('dotenv').config();
const cors = require('cors');
const express = require("express");
const mongoose = require("mongoose");

const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");

const app = express();
const PORT = 5000;
const DB = process.env.MONGODB_CONNECTION_STRING;

app.use(cors());

// middleware
app.use(express.json());
app.use(authRouter);
app.use(userRouter);

mongoose
  .connect(DB)
  .then(() => {
    console.log("connection successful");
  })
  .catch((e) => {
    console.log(e);
  });

app.listen(PORT, "0.0.0.0", () => {
  console.log(`connected at port ${PORT}`);
});
