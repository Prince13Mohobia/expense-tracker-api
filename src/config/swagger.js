const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Expense Tracker API",
      version: "1.0.0",
      description: "Expense Tracker REST API Documentation",
    },

    servers: [
      {
        url: "http://localhost:5000",
      },
      {
        url: "https://expense-tracker-api-6ims.onrender.com",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },

  apis: ["./src/routes/*.js"],
};

module.exports = swaggerJsdoc(options);