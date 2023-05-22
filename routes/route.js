const express = require('express');
const Registration = require('../models/register');
const router = express.Router();
const userController = require('../controllers/usercontroller');
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');

router.use(cookieParser());

async function check(req, res, next) {
  const JWT_SECRET =
    "goK!pusp6ThEdURUtRenOwUhAsWUCLheBazl!uJLPlS8EbreWLdrupIwabRAsiBu";
  const token = req.cookies.jwtToken;
  if (!token) {
    next();
    return;
  }

  try {
    const data = jwt.verify(token, JWT_SECRET);
    const user = await Registration.findOne({ email: data.email });
    req.data = user;
    next();
    return;
  } catch (err) {
    res.clearCookie("jwtToken");
    return res.render("register", { message: "" });
  }
}

// Home page
router.get('/', (req, res) => {
  res.render('index');
});

// Register a new user
router.get('/register', (req, res) => {
  res.render('register');
});
router.post('/register', userController.registerUser);

// Profile page
router.get('/profile', check, async (req, res) => {
  const user = req.data;
  const isAuthenticated = req.data ? true : false;
  if (isAuthenticated) {
    return res.render("profile", { user: req.data });
  } else {
    res.render("register", { message: "Please Login To Access Other Pages" });
  }
});

router.get("/login", async (req, res) => {
  res.render("login");
});

// Login Form Submission (POST)
router.post('/login', userController.login);

// Update user name
router.post('/updatefullname', check, userController.updatename);

// Route for retrieving the previous value
router.post('/retrieve', check, userController.retrieve);

module.exports = { router, check };
