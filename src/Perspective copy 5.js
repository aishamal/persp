//23 june
import React, { useRef, useEffect, useState } from "react";
import perspective from "@finos/perspective";
import "@finos/perspective-viewer";
import "@finos/perspective-viewer-datagrid";
import "@finos/perspective-viewer-d3fc";
import fileData from "./tableData.json";
import "./styles.css";

const dataUrls = [
  { url: "./data.json"
 }
];

export function Perspective() {

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showTables, setShowTables] = useState(false);


  // Get the column names from the data object
  const columns = Object.keys(fileData);

  // Create an array to store the rows
  const rows = [];
  const viewerRefs = {};

  fileData[columns[0]].forEach((value, index) => {
    const row = {};
    columns.forEach(column => {
      row[column] = fileData[column][index];
    });
    rows.push(row);
  });

const pro = Array.from(new Set(rows.map(row => row["Product"])));
const availableProducts = pro.slice(0, 5); // Take the first 2 products

const handleProductSelection = (product) => {
  if (selectedProducts.includes(product)) {
    setSelectedProducts(selectedProducts.filter(p => p !== product));
  } else {
    setSelectedProducts([...selectedProducts, product]);
  }
};

useEffect(() => {

selectedProducts.forEach(product => {

  console.log(product);

  const productRows = rows.filter(row => row["Product"] === product);

    const askData = [];
    const bidData = [];
    const tableData = [];
    const uniqueBids = Array.from(new Set(productRows.map(productRows => productRows["Bid"])));
    const uniqueAsks = Array.from(new Set(productRows.map(productRows => productRows["Ask"])));
    console.log(uniqueBids)
    console.log(uniqueAsks)

    uniqueAsks.forEach(ask => {
      const askValue = (ask);
      askData.push({ "Ask": askValue });

      rows
        .filter(row => row["Ask"] === ask)
        .forEach(row => 
              askData.push( { "Ask": (row["Ask Size"]) }));
    });
    console.log(askData.length)


    uniqueBids.forEach(bid => {
      const bidValue = (bid);
      bidData.push({ "Bid": bidValue });

      rows
        .filter(row => row["Bid"] === bid)
        .forEach(row => 
          bidData.push( { "Bid": (row["Bid Size"]) }));
    });
    console.log(bidData.length)
    const minDataLength  = Math.min(bidData.length, askData.length);

    for (let i = 0; i < minDataLength; i++) {
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

      async function load(ignore) {

        if (ignore) {
          return;
        }

      
        console.log("Hi")
        console.log(table)
  
       prodViewRef.current.load(await table);
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
}, [selectedProducts]);

  return (
    <>
        <div className="ProductSelection">
        <h4>Select Products:</h4>
        {availableProducts.map(product => (
          <label key={product}>
            <input
              type="checkbox"
              value={product}
              checked={selectedProducts.includes(product)}
              onChange={() => handleProductSelection(product)}
            />
            {product}
          </label>
        ))}
      </div>

    <div className="PerspectiveViewerRow">
    {selectedProducts.map(product => (
      <div key={product} className="PerspectiveViewer">
        <h5>{product}</h5>
        <perspective-viewer ref={viewerRefs[product]} />
      </div>
    ))}
  </div>

    </>
  );
}

export default Perspective;
