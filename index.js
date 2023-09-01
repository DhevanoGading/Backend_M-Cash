require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const port = process.env.APP_PORT || 80;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  "*",
  cors({
    origin: true,
    credentials: true,
  })
);

const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const option = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Node JS API M-CASH with Appwrite",
      version: "1.0.0",
    },
    servers: [
      {
        url: `http://localhost:${port}`,
      },
    ],
  },
  apis: [
    "./src/Routes/userRoutes.js",
    "./src/Routes/budgetRoutes.js",
    "./src/Routes/expenseRoutes.js",
  ],
};

app.get("/", (req, res) => {
  res.send({
    message: "Berhasil menampilkan GET",
    data: {
      description: "Berhasil menampilkan data",
    },
  });
});

const swaggerSpec = swaggerJSDoc(option);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/user", require("./src/Routes/userRoutes"));
app.use("/budget", require("./src/Routes/budgetRoutes"));
app.use("/expense", require("./src/Routes/expenseRoutes"));

app.listen(port, () =>
  console.log(`App running at ${process.env.APP_URL}:${port}`)
);
