const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./src/config/db");
const { notFound, errorHandler } = require("./src/middleware/errorMiddleware");

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => {
  res.send("Smart Recipe & Grocery Planner API is running");
});

app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/pantry", require("./src/routes/pantryRoutes"));
app.use("/api/recipes", require("./src/routes/recipeRoutes"));
app.use("/api/grocery", require("./src/routes/groceryRoutes"));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
