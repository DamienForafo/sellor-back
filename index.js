const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser"); // parse body requests before handling it
const cors = require("cors"); // restrict which domains can access
const { verifyToken } = require("./authChecks");
const User = require("./models/User");
const Product = require("./models/Product");

// Import routes
const authRoute = require("./routes/auth");
const usersRoute = require("./routes/users");
const productsRoute = require("./routes/products");

// Read .env and put it in process.env
dotenv.config();

// Connect to DB
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () =>
  console.log("Connected to DB !")
);

// Middlewares
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

// Routes middlewares
app.use("/auth", authRoute);
app.use("*", verifyToken);
app.use("/users", usersRoute);
app.use("/products", productsRoute);

app.listen(3000, () => console.log("Server up and running !"));
