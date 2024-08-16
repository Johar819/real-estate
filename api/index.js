import express from "express";
import { connect } from "mongoose";
import { config } from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listRouter from "./routes/list.route.js";
import cookieParser from "cookie-parser";
import { resolve, join } from "path";
config();
connect(process.env.MONGODB_URL, {})
  .then(() => {
    console.log("Database Connection Established Successfully");
  })
  .catch((err) => {
    console.log("Database Connection Failed");
    console.error(err);
    process.exit(1);
  });

const __dirname = resolve();
const app = express();
app.use(cookieParser());
app.use(json());
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/list", listRouter);
app.use(express.static(join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'client', 'dist', 'index.html'));
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
