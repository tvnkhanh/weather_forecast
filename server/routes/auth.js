const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const auth = require('../middlewares/auth');

const authRouter = express.Router();

module.exports = authRouter;