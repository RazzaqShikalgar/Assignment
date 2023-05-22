const express = require('express');
const Registration = require('../models/register');
const router = express.Router();
const userController = require('../controllers/usercontroller');
const updatename = require('../controllers/usercontroller');
const login = require('../controllers/usercontroller');
// const check = require('../controllers/usercontroller');
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
    console.log(data);
    const user = await Registration.findOne({ email: data.email });
    req.data = user;
    // console.log(user._id);
    next();
    return;
  } catch (err) {
    res.clearCookie("jwtToken");
    return res.render("register", { message: "" });
  }
}


// Home page
router.get('/', (req, res) => {
  const userid = req.body;
  console.log(userid);
  res.render('index');
});

// Register a new user
router.get('/register', (req, res) => {
  res.render('register');
});
router.post('/register', userController.registerUser);

//profile page
router.get('/profile',check,async (req, res) => {
  const user = req.data;
  console.log(user,"This is required details");
  const isAuthenticated = req.data ? true : false;
  if (isAuthenticated) {
    return res.render("profile",{user:req.data});
  } else {
    res.render("register", { message: "Please Login To Access Other Pages" });
  }
});

router.get("/login",async(req,res)=>{
  res.render("login");
});

// Login Form Submission (POST)
router.post('/login',userController.login);
// Update user name
router.post('/updatefullname',check, userController.updatename);
// API routes
// router.post("/profile",userController.updatefields,check);
//retieve old data
// router.post("/retrieve",check,userController.retrieve);
// module.exports = router;
// In this updated code, the /profile route uses the async keyword to define an asynchronous function. Inside the function, the await keyword is used to wait for the

// Route for retrieving the previous value
router.post('/retrieve', check,userController.retrieve);





// router.post("/updatename",userController.updatename);

module.exports = {router,check};
