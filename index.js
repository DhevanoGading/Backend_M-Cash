const express = require("express");
const cors = require("cors");
const db = require("./db");
const port = 8080;

const app = express();
app.use(express.json());
app.use(cors());

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

db.connect((error) => {
  if (error) throw error;
  console.log("mysql connected");
});

app.get("/", (req, res) => {
  res.send({
    message: "Berhasil menampilkan GET",
    data: {
      description: "Berhasil menampilkan data",
    },
  });
});

app.use("/user", require("./Routes/userRoutes"));

app.listen(port, () => console.log(`App running at ${port}`));
