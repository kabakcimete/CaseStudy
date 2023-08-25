const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

mongoose.connect("mongodb://localhost:27017/casestudy", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const NoktaSchema = new mongoose.Schema({
  lat: String,
  lng: String,
  datetime: String,
});

const Nokta = mongoose.model("Nokta", NoktaSchema);

app.use(express.static("public"));

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

app.get("/getpoints", (req, res) => {
  Nokta.find({})
    .then((veriler) => {
      res.json(veriler);
    })
    .catch((err) => {
      console.error("Veriler çekilemedi:", err);
      res.status(500).json({ error: "Veriler çekilemedi" });
    });
});
