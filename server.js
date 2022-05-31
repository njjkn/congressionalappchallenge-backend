const bodyParser = require('body-parser')
const express = require('express')
const helmet = require('helmet')
const morgan = require('morgan')
const connectDB = require('./db')
const home = require('./routes/api/home')

const PORT = 5000;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, OPTIONS, DELETE');
  next();
});

app.use(morgan("dev"))
app.use(helmet())
connectDB();


// http://localhost:5000/api/v1/

app.use("/api/v1/student/voices", home)
app.listen(PORT, console.log(`API is listening on port ${PORT}`))