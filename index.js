const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use("/api/users", userRoute);

//connecting to the DB
const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URL);
};
connectDB();

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
