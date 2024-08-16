const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRouter = require("./routes/user.route.js");
const authRouter = require("./routes/auth.route.js");
const listRouter = require("./routes/list.route.js");
const cookieParser = require("cookie-parser");
const path = require("path");
dotenv.config();
mongoose
  .connect(process.env.MONGODB_URL, {})
  .then(() => {
    console.log("Database Connection Established Successfully");
  })
  .catch((err) => {
    console.log("Database Connection Failed");
    console.error(err);
    process.exit(1);
  });

const __dirname = path.resolve();
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/list", listRouter);
app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || "Something went wrong!";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});
app.listen(3000, () => {
  console.log("Server is running at port 3000!");
});
app.get("/", (req, res) => {
  res.send("Hello World!");
})
