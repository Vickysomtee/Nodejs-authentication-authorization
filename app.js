require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose')

const auth = require('./middlewares/auth')
const authRoute = require('./routes/auth')


const app = express();

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// Route Prefix
app.use('/api/user', authRoute)

app.get('/', (req, res, next) => {
  res.send("Hello There")
}) 

app.get('/dashboard', auth.verifyAccessToken, (req, res, next) => {
  res.send("Hi, Welcome to the dashboard")
})

mongoose
  .connect(process.env.MONGO_URI)
  .then((result) => console.log("DB is Connected"))
  .catch((err) => console.log(err));

app.listen(process.env.PORT, () => {
  console.log("Server is Running");
});
