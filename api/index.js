const express = require("express");
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const userRouter = require('./routes/user.route.js')
const authRouter = require('./routes/auth.route.js')
dotenv.config();
mongoose.connect(process.env.MONGODB_URL, {})
  .then(() => {
    console.log("Database Connection Established Successfully");
  })
  .catch((err) => {
    console.log("Database Connection Failed");
    console.error(err);
    process.exit(1);
  });
const app = express();
app.use(express.json());
app.use('/api/user',userRouter);
app.use('/api/auth',authRouter);
app.listen(3000, () => {
  console.log("Server is running at port 3000!");
});