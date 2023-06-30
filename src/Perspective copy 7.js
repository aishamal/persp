/////26 june working code
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

// import statements are us ed to import required modules and dependencies.
// React, useRef, useEffect, and useState are imported from the "react" library, which enables the usage of React hooks and components.
// The perspective, @finos/perspective-viewer, @finos/perspective-viewer-datagrid, and @finos/perspective-viewer-d3fc packages are imported, which provide functionality for data visualization.
// fileData is imported from "./tableData.json", which contains some data used in the component.
// dataUrls is an array of objects, where each object contains a URL to some data file (e.g., JSON).

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

// The Perspective component is defined as a functional component.
// React state is used with useState to manage the selectedProducts and showTables variables.
// The table variable is an empty object that will be used to store Perspective.js table instances for each product.
// prodViewRef is a reference to the Perspective Viewer component used to load data into it.
// The columns array is created by extracting keys from the fileData object.
// The rows array is initialized and then populated by iterating through the values of fileData object and converting them into rows.
// Unique products are extracted from the rows data and stored in the availableProducts array.

//useEffect(()=>{
    // Loop through each available product

  availableProducts.forEach(product => {

    console.log(product);
  
        // Filter rows data to get only the rows for the current product

    const productRows = rows.filter(row => row["Product"] === product);
  
        // Initialize arrays to store ask, bid, and table data

      const askData = [];
      const bidData = [];
      const tableData = [];

          // Get unique values of asks and bids for the current product

      const uniqueBids = Array.from(new Set(productRows.map(productRows => productRows["Bid"])));
     
         // Process ask data for the current product

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
  
          // Combine bid and ask data into a single tableData array

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

//       For each available product, we filter the productRows array to get only the rows that belong to that product.
// The askData and bidData arrays are initialized to store the processed ask and bid data for the current product.
// We then iterate through the unique asks and process the ask data, including the "Ask Size" for each ask value.
// Similarly, we iterate through the unique bids and process the bid data, including the "Bid Size" for each bid value.
// We then combine the processed bid and ask data into a single tableData array, where each element contains both "Bid" and "Ask" values.
// We create a Perspective.js worker instance and use it to create a table for the tableData of the current product. This table will be used to visualize the data in the Perspective Viewer.
// We create a new ref, prodViewRef, for the Perspective Viewer component of the current product and store it in the viewerRefs object using the current product as the key.
// We use the useEffect hook to load the data table into the Perspective Viewer for the current product when the component mounts. The load function is marked as async since viewerRefs[product].current.load(table[product]) is an asynchronous operation. We also have a cleanup function to prevent any potential memory leaks when the component unmounts or the data changes.
  
     prodViewRef = useRef();
    console.log("useRef")
    viewerRefs[product] = prodViewRef;
  
    useEffect(() => {
      let ignore = false;
      async function load() {
        if (ignore) {
          return;
        }
       // Load the data table into the Perspective Viewer for the current product
        await viewerRefs[product].current.load(table);
      }
      load();
  
      return () => {
        ignore = true;
      };
  }, []);
  console.log("heyyy")
})

//},[showTables]);


// const handleProductSelection = (product) => {

//   console.log("hi")

//   if (selectedProducts.includes(product)) {
//     setSelectedProducts(selectedProducts.filter(p => p !== product));
//   } else {
//     setSelectedProducts([...selectedProducts, product]);
//   }
// };


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



// const handleShowTables = () => {

//   setShowTables(true);
//   console.log("1")

// };

// const handleHideTables = () => {
//   setSelectedProducts([]);
//   setShowTables(false);
// };

// const filteredProducts = showTables ? selectedProducts : [];
// console.log(selectedProducts)

//useEffect(() => {

 //}, [showTables]);

  return (
    <div className="PerspectiveViewerRow">
      {/* {showTables ? ( */}
        <>
          
          {availableProducts.map(product => (
            <div key={product} className="PerspectiveViewer">
              <h5>{product}</h5>
              <perspective-viewer ref={viewerRefs[product]} />
            </div>
          ))}
        </>
      {/* ) : (
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
        </> */}
      {/* )} */}
    </div>
  );
}

export default Perspective;




//////////last try:
// import React, { useRef, useEffect, useState } from "react";
// import perspective from "@finos/perspective";
// import "@finos/perspective-viewer";
// import "@finos/perspective-viewer-datagrid";
// import "@finos/perspective-viewer-d3fc";
// import fileData from "./tableData.json";
// import "./styles.css";

// const dataUrls = [
//   { url: "./data.json"
//  }
// ];

// export function Perspective() {

//   const [selectedProducts, setSelectedProducts] = useState([]);
//   const [showTables, setShowTables] = useState(false);
//   let table = {};
//  // let prodViewRef = useRef(null);
//   const columns = Object.keys(fileData);
//   const rows = [];
//   const viewerRefs = {};

//   fileData[columns[0]].forEach((value, index) => {
//     const row = {};
//     columns.forEach(column => {
//       row[column] = fileData[column][index];
//     });
//     rows.push(row);
//   });

// const pro = Array.from(new Set(rows.map(row => row["Product"])));
// const availableProducts = pro.slice(0, 5); // Take the first 2 products



// // useEffect(()=>{
//   // selectedProducts.forEach(product => {

//   //   console.log(product);
  
//   //   const productRows = rows.filter(row => row["Product"] === product);
  
//   //     const askData = [];
//   //     const bidData = [];
//   //     const tableData = [];
//   //     const uniqueBids = Array.from(new Set(productRows.map(productRows => productRows["Bid"])));
//   //     const uniqueAsks = Array.from(new Set(productRows.map(productRows => productRows["Ask"])));
//   //     console.log(uniqueBids)
//   //     console.log(uniqueAsks)
  
//   //     uniqueAsks.forEach(ask => {
//   //       const askValue = (ask);
//   //       askData.push({ "Ask": askValue });
  
//   //       rows
//   //         .filter(row => row["Ask"] === ask)
//   //         .forEach(row => 
//   //               askData.push( { "Ask": (row["Ask Size"]) }));
//   //     });
//   //     console.log(askData.length)
  
  
//   //     uniqueBids.forEach(bid => {
//   //       const bidValue = (bid);
//   //       bidData.push({ "Bid": bidValue });
  
//   //       rows
//   //         .filter(row => row["Bid"] === bid)
//   //         .forEach(row => 
//   //           bidData.push( { "Bid": (row["Bid Size"]) }));
//   //     });
//   //     console.log(bidData.length)
//   //     const minDataLength  = Math.min(bidData.length, askData.length);
  
//   //     for (let i = 0; i < minDataLength; i++) {
//   //       const row = {
//   //         "Bid": (bidData[i].Bid),
//   //         "Ask": (askData[i].Ask)
//   //       };
//   //       tableData.push(row);
//   //     }

//   //     const worker = perspective.worker();
//   //      table = worker.table(tableData);

//   //     console.log("heyyy")

  
//   //    prodViewRef = useRef();
//   //   console.log("useRef")
//   //   viewerRefs[product] = prodViewRef;
  
//   //   useEffect(() => {
//   //     let ignore = false;
//   //     async function load() {
//   //       if (ignore) {
//   //         return;
//   //       }
//   //       await viewerRefs[product].current.load(table);
//   //     }
//   //     load();
  
//   //     return () => {
//   //       ignore = true;
//   //     };
//   // }, []);

  
//   // });

//   // console.log("heyyy")

// // },[showTables]);


// const handleProductSelection = (product) => {

//   console.log("hi")

//   if (selectedProducts.includes(product)) {
//     setSelectedProducts(selectedProducts.filter(p => p !== product));
//   } else {
//     setSelectedProducts([...selectedProducts, product]);
//   }
// };


// // useEffect(()=>{
// //   console.log("heyyy")
// //   let ignore = false;
// //   async function load() {
// //   if (ignore) {
// //     return;
// //   }
// //   console.log(table)

// //   await prodViewRef.current.load(table);
// // }

// // load();

// //   return () => {
// //     ignore = true;
// //   };
// //  }, [showTables]);



// const handleShowTables = () => {

//   selectedProducts.forEach(product => {

//     console.log(product);
  
//     const productRows = rows.filter(row => row["Product"] === product);
  
//       const askData = [];
//       const bidData = [];
//       const tableData = [];
//       const uniqueBids = Array.from(new Set(productRows.map(productRows => productRows["Bid"])));
//       const uniqueAsks = Array.from(new Set(productRows.map(productRows => productRows["Ask"])));
//       console.log(uniqueBids)
//       console.log(uniqueAsks)
  
//       uniqueAsks.forEach(ask => {
//         const askValue = (ask);
//         askData.push({ "Ask": askValue });
  
//         rows
//           .filter(row => row["Ask"] === ask)
//           .forEach(row => 
//                 askData.push( { "Ask": (row["Ask Size"]) }));
//       });
//       console.log(askData.length)
  
  
//       uniqueBids.forEach(bid => {
//         const bidValue = (bid);
//         bidData.push({ "Bid": bidValue });
  
//         rows
//           .filter(row => row["Bid"] === bid)
//           .forEach(row => 
//             bidData.push( { "Bid": (row["Bid Size"]) }));
//       });
//       console.log(bidData.length)
//       const minDataLength  = Math.min(bidData.length, askData.length);
  
//       for (let i = 0; i < minDataLength; i++) {
//         const row = {
//           "Bid": (bidData[i].Bid),
//           "Ask": (askData[i].Ask)
//         };
//         tableData.push(row);
//       }

//       const worker = perspective.worker();
//        table = worker.table(tableData);

//       console.log("heyyy")

  
//     const prodViewRef = useRef();
//     console.log("useRef")
//     viewerRefs[product] = prodViewRef;

//     useEffect(() => {
//       let ignore = false;
//       async function load() {
//         if (ignore) {
//           return;
//         }
//         await viewerRefs[product].current.load(table);
//       }
//       load();
  
//       return () => {
//         ignore = true;
//       };
//   }, []);
  
//   });

//   console.log("heyyy")

//   setShowTables(true);
//   console.log("1")

// };

// const handleHideTables = () => {
//   setSelectedProducts([]);
//   setShowTables(false);
// };

// const filteredProducts = showTables ? selectedProducts : [];
// console.log(selectedProducts)

// //useEffect(() => {

//  //}, [showTables]);

//   return (
//     <div className="PerspectiveViewerRow">
//       {showTables ? (
//         <>
//           <button onClick={handleHideTables}>Hide Tables</button>
//           {filteredProducts.map(product => (
//             <div key={product} className="PerspectiveViewer">
//               <h5>{product}</h5>
//               <perspective-viewer ref={viewerRefs[product]} />
//             </div>
//           ))}
//         </>
//       ) : (
//         <>
//           <div className="ProductSelection">
//             <h4>Select Products:</h4>
//             {availableProducts.map(product => (
//               <label key={product}>
//                 <input
//                   type="checkbox"
//                   value={product}
//                   checked={selectedProducts.includes(product)}
//                   onChange={() => handleProductSelection(product)}
//                 />
//                 {product}
//               </label>
//             ))}
//           </div>    
//           <button onClick={handleShowTables} disabled={selectedProducts.length === 0}>
//             Show Tables
//           </button>
//         </>
//       )}
//     </div>
//   );
// }

// export default Perspective;
