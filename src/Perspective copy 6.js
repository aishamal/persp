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
  let table = {};
  let prodViewRef = useRef(null);
  const columns = Object.keys(fileData);
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

useEffect(()=>{
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
       table = worker.table(tableData);

      console.log("heyyy")

  
     prodViewRef = useRef();
    console.log("useRef")
    viewerRefs[product] = prodViewRef;
  
  //   let ignore = false;
  //   async function load() {
  //   if (ignore) {
  //     return;
  //   }
  //   console.log(table)
  
  //   await prodViewRef.current.load(table);
  // }
  
 // load();
  
    return () => {
      ignore = true;
    };
  
  });

  console.log("heyyy")

},[showTables]);


const handleProductSelection = (product) => {

  console.log("hi")

  if (selectedProducts.includes(product)) {
    setSelectedProducts(selectedProducts.filter(p => p !== product));
  } else {
    setSelectedProducts([...selectedProducts, product]);
  }
};


// useEffect(()=>{
//   console.log("heyyy")
//   let ignore = false;
//   async function load() {
//   if (ignore) {
//     return;
//   }
//   console.log(table)

//   await prodViewRef.current.load(table);
// }

// load();

//   return () => {
//     ignore = true;
//   };
//  }, [showTables]);



const handleShowTables = () => {

  setShowTables(true);
  console.log("1")

};

const handleHideTables = () => {
  setSelectedProducts([]);
  setShowTables(false);
};

const filteredProducts = showTables ? selectedProducts : [];
console.log(selectedProducts)

//useEffect(() => {

 //}, [showTables]);

  return (
    <div className="PerspectiveViewerRow">
      {showTables ? (
        <>
          <button onClick={handleHideTables}>Hide Tables</button>
          {filteredProducts.map(product => (
            <div key={product} className="PerspectiveViewer">
              <h5>{product}</h5>
              <perspective-viewer ref={viewerRefs[product]} />
            </div>
          ))}
        </>
      ) : (
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
          <button onClick={handleShowTables} disabled={selectedProducts.length === 0}>
            Show Tables
          </button>
        </>
      )}
    </div>
  );
}

export default Perspective;
