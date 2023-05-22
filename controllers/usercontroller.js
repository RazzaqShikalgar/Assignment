const Registration = require('../models/register');
const jwt = require("jsonwebtoken");
const check = require("../routes/route.js");

const registerUser = async (req, res) => {
  try {
    const registrationData = req.body;
    const email = req.body.email;
    const JWT_SECRET = "goK!pusp6ThEdURUtRenOwUhAsWUCLheBazl!uJLPlS8EbreWLdrupIwabRAsiBu";

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "2h" });
    registrationData.token = token;
    const registration = new Registration(registrationData);

    const savedRegistration = await registration.save();

    console.log(savedRegistration);
    res.render('success');
  } catch (error) {
    console.error('Error saving registration data:', error);
    res.status(500).json({ error: 'Failed to save registration data' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const JWT_SECRET = "goK!pusp6ThEdURUtRenOwUhAsWUCLheBazl!uJLPlS8EbreWLdrupIwabRAsiBu";

  try {
    const user = await Registration.findOne({ email });

    if (!user) {
      return res.json('User not found');
    }

    if (password === user.password) {
      const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "2h" });
      return res
        .cookie("jwtToken", token, {
          expires: new Date(Date.now() + 25892000000),
          httpOnly: true,
        })
        .redirect("/");
    } else {
      res.send('Invalid password');
      req.session.errorMessage = "Invalid password";
    }
  } catch (error) {
    console.error('Error finding user:', error);
    res.send('An error occurred');
  }
};

const updatename = async (req, res) => {
  try {
    const userId = req.data._id;
    const { fieldName, value } = req.body;

    const user = await Registration.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const previousValue = user[fieldName];

    user[fieldName] = value;

    const updatedUser = await user.save();

    updatedUser.previousValues = {
      [fieldName]: previousValue,
    };
    console.log(previousValue);

    const savedUser = await updatedUser.save();

    res.json(savedUser);
  } catch (error) {
    console.error('Error updating field:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

const retrieve = async (req, res) => {
  const userId = req.data._id;
  const fieldName = 'fullName';

  try {
    const user = await Registration.findById(userId);

    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    if (user.previousValues && user.previousValues.hasOwnProperty(fieldName)) {
      const previousValue = user.previousValues[fieldName];

      user.fullName = previousValue;

      await user.save();

      return res.json({ success: true, message: 'Previous value retrieved and updated successfully', value: previousValue });
    } else {
      return res.json({ success: false, message: 'No previous value found' });
    }
  } catch (error) {
    console.error('Error retrieving and updating previous value:', error);
    return res.status(500).json({ success: false, message: 'An error occurred while retrieving and updating the previous value' });
  }
};

module.exports = {
  registerUser,
  updatename,
  login,
  retrieve,
};
