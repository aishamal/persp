///////19 june
import React, { useRef, useEffect, useState } from "react";

import perspective from "@finos/perspective";
import "@finos/perspective-viewer";
import "@finos/perspective-viewer-datagrid";
import "@finos/perspective-viewer-d3fc";
// import "@finos/perspective-viewer/dist/umd/all-themes.css";
// import jsonData from "./data.json";
import fileData from "./tableData.json";
import axios from "axios";
import "./styles.css";

console.log(fileData)
const dataUrls = [
  { url: "./data.json"
 }
];

export function Perspective() {

  // Get the column names from the data object
const columns = Object.keys(fileData);

// Create an array to store the rows
const rows = [];

// Loop through the values and create a row object for each index
fileData[columns[0]].forEach((value, index) => {
  const row = {};
  columns.forEach(column => {
    row[column] = fileData[column][index];
  });
  rows.push(row);
});
console.log(rows);

// const tableData = {
//   Bid: [],
//   "Bid Size": []
// };

const tableData = [];
const uniqueBids = Array.from(new Set(fileData["Bid"]));
const uniqueAsks = Array.from(new Set(fileData["Ask"]));

// console.log(uniqueBids);

const askdata = [];
uniqueAsks.forEach(ask => {
  const askValue = Math.floor(ask);
  askdata.push({ "Ask": askValue });

  rows
    .filter(row => row["Ask"] === ask)
    .forEach(row => 
           askdata.push( { "Ask": Math.floor(row["Ask Size"]) }));
});

const bidData = [];
uniqueBids.forEach(bid => {
  const bidValue = Math.floor(bid);
  bidData.push({ "Bid": bidValue });

  rows
    .filter(row => row["Bid"] === bid)
    .forEach(row => 
      bidData.push( { "Bid": (row["Bid Size"]) }));
});

for (let i = 0; i < bidData.length; i++) {
  const row = {
    "Bid": Math.floor(bidData[i].Bid),
    "Ask": Math.floor(askdata[i].Ask)
  };
  tableData.push(row);
}

// let askIndex = 0; // Variable to keep track of the current index

// function getAskValueForBid(bid) {
//   // Replace this logic with your custom implementation
//   // You can use the uniqueAsks array to retrieve the Ask value for the corresponding Bid

//   // Check if the askIndex is within the bounds of the uniqueAsks array
//   if (askIndex < uniqueAsks.length) {
//     const ask = uniqueAsks[askIndex];
//     askIndex++; // Update the index for the next call
//     return ask;
//   } else {
//     // Handle the case where there are no more values in the array
//     return null; // or any other appropriate value
//   }
// }


// uniqueBids.forEach(bid => {
//   const ask = getAskValueForBid(bid); // Replace this with your logic to retrieve the Ask value for the current Bid

//   tableData.push({ "Bid": bid});

//   rows
//     .filter(row => row["Bid"] === bid)
//     .forEach(row => 
//       tableData.push( { "Bid": row["Bid Size"] }));

//  //   updatedTableData()
// });


//console.log(data);

// Add a new column to each object in tableData
// const updatedTableData = tableData.map((row, index) => {

//   console.log("hi")
//   const newRow = { ...row }; // Create a new object to avoid mutating the original row

//   uniqueAsks.forEach(ask => {
//     tableData.push({ "Ask": ask });
  
//     rows
//       .filter(row => row["Ask"] === ask)
//       .forEach(row => newRow["Ask"] = row["Ask Size"]);
//   });

  
//   // Add the new column to the current row

//   return newRow;
// });


// tableData = updatedTableData;

// uniqueAsks.forEach(ask => {
//   tableData.push({ "Ask": ask });

//   rows
//     .filter(row => row["Ask"] === ask)
//     .forEach(row => tableData.push( { "Ask": row["Ask Size"] }));
// });

//tableData.
// const uniqueBids = Array.from(new Set(fileData["Bid"]));

// uniqueBids.forEach(bid => {
//   tableData.Bid.push(bid);
//   tableData.Bid.push(
//     rows.filter(row => row["Bid"] === bid).map(row => row["Bid Size"])
//   );
//});
// console.log(tableData);

////////////////////////////////////////////////////////////////
  const viewerRef = useRef();

  const [selectedDataUrl, setSelectedDataUrl] = useState(dataUrls[0]);

  const worker = perspective.worker();

  const table = worker.table(tableData);
      // Returns a new View, pivoted in the row space by the "name" column.

      document.addEventListener("DOMContentLoaded", () => {
        const el = document.getElementsByTagName("perspective-viewer")[0];
        if (el) {
          console.log("el is there")
          el.load(table);
          el.restore({settings: true, plugin_config: {editable: true}});
        }
      });
      

      

  useEffect(() => {
    let ignore = false;
    async function load() {
     // console.log(jsonData);

      if (ignore) {
        return;
      }
      // const worker = perspective.worker();

      // const table = worker.table(jsonData);

      await viewerRef.current.load(table);
    }

    load();

    return () => {
      ignore = true;
    };
}, [fileData]);



// Print the unique values from the "Bid" column along with their corresponding values from the "Bid Size" column
// const uniqueBids = Array.from(new Set(fileData["Bid"]));
// uniqueBids.forEach(bid => {
//   console.log(bid);
//   rows
//     .filter(row => row["Bid"] === bid)
//     .forEach(row => console.log(row["Bid Size"]));
// });

// window.addEventListener("load", async () => {
//   let req = await fetch("./layout.json");
//   let layout = await req.json();

//   window.workspace.tables.set("movies", datasource());

//   window.workspace.restore(layout);
// });

// useEffect(() => {
//   const intervalId = setInterval(() => {
//     const newData = 
//       {"Name": "Aisha", "Age": Math.random()*10, "Country": "India"};

//     axios
//       .post("http://localhost:3000/append", newData)
//       .then(() => {
//         console.log("Data appended successfully");
//       })
//       .catch((error) => {
//         console.error("Error appending data:", error);
//       });
//   }, 50);
  

//   return () => {
//     clearInterval(intervalId);
//   };
// }, []);

// useEffect(() => {
//   const intervalId = setInterval(() => {

//   // axios.get("http://localhost:3000/api/data")
//   axios.get("http://localhost:3000/api/data")
//   .then(async response => {
//     const data = response.data;
//     (await table).update(data, { mode: "add" });
//     console.log(data);
//     })
//   .catch(error => {
//     console.error("Error fetching data:", error);
//   });
// }, 100);

// return () => {
//   clearInterval(intervalId);
// };
// }, []);

//table.view({group_by: ["Name"]});

  return (
    <>
     
      <div className="PerspectiveViewer">
        <perspective-viewer editable ref={viewerRef} />
      </div>
    </>
  );
}

export default Perspective;
