require('dotenv').config();
const ejs = require('ejs');
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const {router} = require('./routes/route');
const cookieParser = require('cookie-parser');


const app = express();
const PORT = process.env.PORT || 3000;
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));


app.use('/', router);
app.use(cookieParser());

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('File Not Found');
    err.status = 404;
    next(err);
  });

  
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });