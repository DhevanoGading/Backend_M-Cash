require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const port = process.env.APP_PORT || 80;

const app = express();
app.use(express.json());
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send({
    message: "Berhasil menampilkan GET",
    data: {
      description: "Berhasil menampilkan data",
    },
  });
});

app.use("/user", require("./src/Routes/userRoutes"));

app.listen(port, () =>
  console.log(`App running at ${process.env.APP_URL}:${port}`)
);
