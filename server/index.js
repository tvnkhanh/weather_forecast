const express = require("express");
const mongoose = require("mongoose");

const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");

const app = express();
const PORT = 5000;
const DB =
  "mongodb+srv://tvnkhanh:2042002lol@cluster0.bsdbs7v.mongodb.net/weather?retryWrites=true&w=majority&appName=Cluster0";

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
