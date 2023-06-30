// server.js

const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors()); // Enable CORS for all routes


app.use(express.json());

app.post("/append", (req, res) => {
  const newData = req.body;
console.log(newData);

  // Read the existing JSON file
  let existingData;
  try {
    existingData = JSON.parse(fs.readFileSync('../data/dataa.json'));
  } catch (err) {
    console.error('Error parsing existing data:', err);
    return res.sendStatus(500);
  }

  // Append the new data
  const updatedData = [...existingData, newData];
  console.log(updatedData);

 // Write the updated data back to the file
  try {
    fs.writeFileSync('../data/dataa.json', JSON.stringify(updatedData, null, 2));
    return res.sendStatus(200);
  } catch (err) {
    console.error('Error writing updated data:', err);
    return res.sendStatus(500);
  }

 // res.sendStatus(200);
});

app.get("/api/data", (req, res) => {
    const jsonData = fs.readFileSync("../data/dataa.json");
    const data = JSON.parse(jsonData);
    print(res.json(data))
    return res.json(data);
    // console.log(res.json(data))
  });
  
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
