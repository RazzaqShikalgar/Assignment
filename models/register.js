const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  token:{
    type:String
  },
  previousValues: {
    type: Object,
    default: {},
  },
  fullName: {
    type: String,
    // required: true
  },
  email: {
    type: String,
    // required: true
  },
  phoneNumber: {
    type: String,
    // required: true
  },
  password:{
    type:String,
  },
  birthDate: {
    type: Date,
    // required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    // required: true
  },
  address: {
    streetAddress: {
      type: String,
      // required: true
    },
    streetAddressLine2: {
      type: String,
      // required: true
    },
    country: {
      type: String,
      // required: true
    },
    city: {
      type: String,
      // required: true
    }
  },
});

const Registration = mongoose.model('Registration', registrationSchema);

module.exports = Registration;
