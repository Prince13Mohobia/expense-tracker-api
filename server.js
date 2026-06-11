require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const expenseRoutes = require("./src/routes/expenseRoutes");

const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./src/config/swagger");

const errorHandler = require(
  "./src/middleware/errorHandler"
);
const dns = require("dns");

dns.setDefaultResultOrder(
  "ipv4first"
);
const app = express();

connectDB();

app.use(express.json());
app.use(cors());

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

app.get("/", (req, res) => {
  res.send("Expense Tracker API Running");
});

app.use("/api/auth", authRoutes);

app.use(
  "/api/expenses",
  expenseRoutes
);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpecs)
);

app.use(errorHandler);

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});