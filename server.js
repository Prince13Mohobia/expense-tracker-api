// require('dotenv').config();

// const express = require("express");
// const cors = require("cors");

// const connectDB = require('./src/config/db');

// const app = express();

// connectDB();

// app.use(express.json());

// app.use(cors());

// app.get("/", (req, res) => {
//   res.send("Expense Tracker API Running...");
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(
//     `Server running on port ${PORT}`
//   );
// });



// require("dotenv").config();

// const express = require("express");
// const cors = require("cors");

// const connectDB = require("./src/config/db");
// const authRoutes = require("./src/routes/authRoutes");

// const app = express();

// // connectDB(); // keep commented until Atlas issue fixed

// app.use(express.json());
// app.use(cors());

// app.get("/", (req, res) => {
//   res.send("Expense Tracker API Running...");
// });

// // Auth Routes
// app.use("/api/auth", authRoutes);

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });




require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");

const app = express();

connectDB();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Expense Tracker API Running");
});

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const expenseRoutes = require(
  "./src/routes/expenseRoutes"
);

app.use(
  "/api/expenses",
  expenseRoutes
);