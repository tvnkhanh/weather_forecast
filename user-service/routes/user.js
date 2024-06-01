const express = require("express");
const auth = require("../middlewares/auth");
const User = require("../models/user");

const userRouter = express.Router();

userRouter.get("/api/users", auth, async (req, res, next) => {
    try {
        const users = await User.find();
        res.json(users);
      } catch (err) {
        res.status(500).send(err);
      }
});

module.exports = userRouter;