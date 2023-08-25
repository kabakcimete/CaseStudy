var map = L.map("map").setView([40.8573522, 29.4146839], 13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

let markers = [];
let pointId = 0;

function addMarker(latlng) {
  const marker = L.marker(latlng);
  marker.addTo(map);
  markers.push({
    id: pointId++,
    lat: latlng.lat,
    lng: latlng.lng,
    datetime: new Date().toISOString(),
  });

  updatePointList();
}

function updatePointList() {
  const pointList = document.getElementById("pointList");
  pointList.innerHTML = "";

  markers.forEach((marker) => {
    const listItem = document.createElement("div");
    listItem.innerHTML = `<p>Id: ${marker.id}<br>Lat: ${marker.lat.toFixed(
      5
    )}<br>Lng: ${marker.lng.toFixed(5)}<br>Date: ${marker.datetime}</p>`;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Sil";
    deleteButton.addEventListener("click", () => {
      markers = markers.filter((m) => m.id !== marker.id);
      map.removeLayer(marker);
      updatePointList();
    });

    listItem.appendChild(deleteButton);
    pointList.appendChild(listItem);
  });
}

document.getElementById("saveButton").addEventListener("click", () => {
  const center = map.getCenter();
  addMarker(center);
  savePointsToJson();
  var yeniNokta = new Nokta({
    lat: center.lat.toFixed(5),
    lng: center.lng.toFixed(5),
    datetime: new Date().toISOString(),
  });
  yeniNokta
    .save()
    .then(() => {
      console.log("Nokta kaydedildi");
    })
    .catch((err) => {
      console.error("Nokta kaydedilemedi:", err);
    });
});

document.getElementById("downloadButton").addEventListener("click", () => {
  const data = JSON.stringify(markers, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "points.json";
  a.click();

  URL.revokeObjectURL(url);
});

var points = [];

// Sayfa yüklendiğinde verileri çek ve ekranda göster
window.addEventListener("load", function () {
  fetch("/getpoints")
    .then((response) => response.json())
    .then((data) => {
      points = data;
      updatePointList();
      // Verileri haritada da göstermek isterseniz burada marker'ları ekleyebilirsiniz
    });
});
function savePointsToJson() {
  var jsonData = JSON.stringify(points, null, 2);
  fetch("/getpoints", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: jsonData,
  });
}

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/casestudy", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const NoktaSchema = new mongoose.Schema({
  lat: String,
  lng: String,
  datetime: String,
});
