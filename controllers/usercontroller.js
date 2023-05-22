const Registration = require('../models/register');
const jwt = require("jsonwebtoken");
const check = require("../routes/route.js");

const registerUser = async (req, res) => {
  try {
    const registrationData = req.body;
    const email = req.body.email;

    JWT_SECRET = "goK!pusp6ThEdURUtRenOwUhAsWUCLheBazl!uJLPlS8EbreWLdrupIwabRAsiBu";

    // Create a new instance of the Registration model with the form data
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "2h" });
    registrationData.token = token;
    const registration = new Registration(registrationData);

    // Save the registration data to the database
    const savedRegistration = await registration.save();

    console.log(savedRegistration);
    res.render('success');
  } catch (error) {
    console.error('Error saving registration data:', error);
    res.status(500).json({ error: 'Failed to save registration data' });
  }
};

// Login logic
const login = async (req, res) => {
  const { email, password } = req.body;
  JWT_SECRET =
  "goK!pusp6ThEdURUtRenOwUhAsWUCLheBazl!uJLPlS8EbreWLdrupIwabRAsiBu";
  // console.log(email);

  try {
    // Find the user record based on the email
    const user = await Registration.findOne({ email });

    if (!user) {
      return res.json('User not found'); // User with the provided email not found
    }
    // Compare the password
    if (password === user.password) {
      // res.render("profile");// Password matches, login successful
      const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "2h" });
      // req.session.successMessage = "Login successful";
      return res
        .cookie("jwtToken", token, {
          expires: new Date(Date.now() + 25892000000),
          httpOnly: true,
        })
        .redirect("/");
    } else {
      res.send('Invalid password'); // Password does not match
      req.session.errorMessage = "Invalid password";

    }
  } catch (error) {
    console.error('Error finding user:', error);
    res.send('An error occurred'); // Error occurred while finding the user
  }
};

// Route handler for updating full name
const updatename = async (req, res) => {
  try {
    const userId = req.data._id;
    const { fieldName, value } = req.body;

    // Find the user by ID
    const user = await Registration.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Store the previous value
    const previousValue = user[fieldName];

    // Update the field value
    user[fieldName] = value;

    // Save the updated user
    const updatedUser = await user.save();

    // Update the previousValues field with the previous value
    updatedUser.previousValues = {
      [fieldName]: previousValue,
    };
    console.log(previousValue);

    // Save the updated user with the previous value
    const savedUser = await updatedUser.save();

    res.json(savedUser);
  } catch (error) {
    console.error('Error updating field:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

// Route for retrieving the previous value and updating the fullName field
const retrieve = async (req, res) => {
  const userId = req.data._id;
  const fieldName = 'fullName';

  try {
    // Find the user by their ID
    const user = await Registration.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    // Check if the previous value exists for the field
    if (user.previousValues && user.previousValues.hasOwnProperty(fieldName)) {
      // Retrieve the previous value
      const previousValue = user.previousValues[fieldName];

      // Update the main fullName field with the previous value
      user.fullName = previousValue;

      // Save the updated user
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
