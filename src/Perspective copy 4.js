// ///////22 june
// import React, { useRef, useEffect, useState } from "react";

// import perspective from "@finos/perspective";
// import "@finos/perspective-viewer";
// import "@finos/perspective-viewer-datagrid";
// import "@finos/perspective-viewer-d3fc";
// // import "@finos/perspective-viewer/dist/umd/all-themes.css";
// // import jsonData from "./data.json";
// import fileData from "./tableData.json";
// import axios from "axios";
// import "./styles.css";

// console.log(fileData)
// const dataUrls = [
//   { url: "./data.json"
//  }
// ];

// export function Perspective() {

//   // Get the column names from the data object
// const columns = Object.keys(fileData);

// // Create an array to store the rows
// const rows = [];

// // Loop through the values and create a row object for each index
// fileData[columns[0]].forEach((value, index) => {
//   const row = {};
//   columns.forEach(column => {
//     row[column] = fileData[column][index];
//   });
//   rows.push(row);
// });
// console.log(rows);

// const tableData = [];
// const uniqueBids = Array.from(new Set(fileData["Bid"]));
// const uniqueAsks = Array.from(new Set(fileData["Ask"]));

// // console.log(uniqueBids);

// const askData = [];
// uniqueAsks.forEach(ask => {
//   const askValue = (ask);
//   askData.push({ "Ask": askValue });

//   rows
//     .filter(row => row["Ask"] === ask)
//     .forEach(row => 
//            askData.push( { "Ask": (row["Ask Size"]) }));
// });

// const bidData = [];
// uniqueBids.forEach(bid => {
//   const bidValue = (bid);
//   bidData.push({ "Bid": bidValue });

//   rows
//     .filter(row => row["Bid"] === bid)
//     .forEach(row => 
//       bidData.push( { "Bid": (row["Bid Size"]) }));
// });

// for (let i = 0; i < bidData.length; i++) {
//   const row = {
//     "Bid": (bidData[i].Bid),
//     "Ask": (askData[i].Ask)
//   };
//   tableData.push(row);
// }
//   const viewerRef = useRef();
//   console.log(viewerRef)

//   const [selectedDataUrl, setSelectedDataUrl] = useState(dataUrls[0]);

//   const worker = perspective.worker();

//   const table = worker.table(tableData);
//       // Returns a new View, pivoted in the row space by the "name" column.

//       document.addEventListener("DOMContentLoaded", () => {
//         const el = document.getElementsByTagName("perspective-viewer")[0];
//         if (el) {
//           console.log("el is there")
//           el.load(table);
//           el.restore({settings: true, plugin_config: {editable: true}});
//         }
//       });

//   useEffect(() => {
//     let ignore = false;
//     async function load() {
//      // console.log(jsonData);

//       if (ignore) {
//         return;
//       }
//       // const worker = perspective.worker();

//       // const table = worker.table(jsonData);

//       await viewerRef.current.load(table);
//       console.log(viewerRef);
//     }

//     load();

//     return () => {
//       ignore = true;
//     };
// }, [fileData]);

//   return (
//     <>
     
//       <div className="PerspectiveViewer">
//         <perspective-viewer editable ref={viewerRef} />
//       </div>
//     </>
//   );
// }

// export default Perspective;




import React, { useRef, useEffect, useState } from "react";

import perspective from "@finos/perspective";
import "@finos/perspective-viewer";
import "@finos/perspective-viewer-datagrid";
import "@finos/perspective-viewer-d3fc";
import fileData from "./tableData.json";
import axios from "axios";
import "./styles.css";

const dataUrls = [
  { url: "./data.json"
 }
];

export function Perspective() {

  // Get the column names from the data object
const columns = Object.keys(fileData);

// Create an array to store the rows
const rows = [];
const viewerRefs = {};

// Loop through the values and create a row object for each index
fileData[columns[0]].forEach((value, index) => {
  const row = {};
  columns.forEach(column => {
    row[column] = fileData[column][index];
  });
  rows.push(row);
});
//console.log(rows);

const pro = Array.from(new Set(rows.map(row => row["Product"])));
console.log(pro)
const products = pro.slice(0, 4); // Take the first 2 products
console.log(products)

products.forEach(product => {

  console.log(product);

  const productRows = rows.filter(row => row["Product"] === product);

    const askData = [];
    const bidData = [];
    const tableData = [];
    const uniqueBids = Array.from(new Set(productRows.map(productRows => productRows["Bid"])));
    const uniqueAsks = Array.from(new Set(productRows.map(productRows => productRows["Ask"])));

    uniqueAsks.forEach(ask => {
      const askValue = (ask);
      askData.push({ "Ask": askValue });

      rows
        .filter(row => row["Ask"] === ask)
        .forEach(row => 
              askData.push( { "Ask": (row["Ask Size"]) }));
    });

    uniqueBids.forEach(bid => {
      const bidValue = (bid);
      bidData.push({ "Bid": bidValue });

      rows
        .filter(row => row["Bid"] === bid)
        .forEach(row => 
          bidData.push( { "Bid": (row["Bid Size"]) }));
    });

    for (let i = 0; i < bidData.length; i++) {
      const row = {
        "Bid": (bidData[i].Bid),
        "Ask": (askData[i].Ask)
      };
      tableData.push(row);
    }

    const worker = perspective.worker();
    const table = worker.table(tableData);

  const prodViewRef = useRef();
  viewerRefs[product] = prodViewRef;
 // console.log(viewerRefs[product])
  //console.log(viewerRef);

      // Returns a new View, pivoted in the row space by the "name" column.    

      async function load(ignore) {

        if (ignore) {
          return;
        }

      
        console.log("Hi")
        console.log(table)
  
       prodViewRef.current.load(await table);
  
        //viewerRefs[product]=prodViewRef
        //console.log(viewerRefs[product])
  
      }

      
  useEffect(() => {
    let ignore = false;
    load(ignore);

    return () => {
      ignore = true;
    };
}, []);
console.log(viewerRefs[product]);

});


  // return (
  //   <>
  //    <div key={product} className="PerspectiveViewer">
  //       <perspective-viewer editable ref={prodViewRef} />
  //     </div>
  //   </>
  // );

  return (
    <div className="PerspectiveViewerRow">
    {products.map(product => (
      <div key={product} className="PerspectiveViewer">
        <h2>{product}</h2>
        <perspective-viewer ref={viewerRefs[product]} />
      </div>
    ))}
  </div>
  );



}

export default Perspective;
