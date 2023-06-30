//29 june  till 2:40

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
  const [show, setShow] = useState(false);

  let table = {};
  let prodViewRef = useRef(null);
  const columns = Object.keys(fileData);
  const rows = [];
  const viewerRefs = {};
  const worker = perspective.worker();
//console.log(worker)


  fileData[columns[0]].forEach((value, index) => {
    const row = {};
    columns.forEach(column => {
      row[column] = fileData[column][index];
    });
    rows.push(row);
  });

const pro = Array.from(new Set(rows.map(row => row["Product"])));
const availableProducts = pro.slice(0, 5); // Take the first 2 products

//const workerPromise = perspective.worker();
// workerPromise.then(worker => {
  availableProducts.forEach(product => {
    prodViewRef = useRef();
    console.log("useRef")
    viewerRefs[product] = prodViewRef;

  })
// })

// useEffect(()=>{

// },[showTables]);

const handleShowTables = () => {
  setShowTables(true);
};

useEffect(() => {
  if (showTables) {
    availableProducts.forEach(product => {
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
            askData.push({ "Ask": (row["Ask Size"]) }));
      });
      console.log(askData.length)

      uniqueBids.forEach(bid => {
        const bidValue = (bid);
        bidData.push({ "Bid": bidValue });

        rows
          .filter(row => row["Bid"] === bid)
          .forEach(row =>
            bidData.push({ "Bid": (row["Bid Size"]) }));
      });
      console.log(bidData.length)

      const minDataLength = Math.min(bidData.length, askData.length);

      for (let i = 0; i < minDataLength; i++) {
        const row = {
          "Bid": (bidData[i].Bid),
          "Ask": (askData[i].Ask)
        };
        tableData.push(row);
      }

      const worker = perspective.worker();
       table[product] = worker.table(tableData);

       let ignore = false;
       async function load() {
         if (ignore) {
           return;
         }
         console.log(table[product])

         await viewerRefs[product].current.load(await table[product]);
     }

     load();

      //  return () => {
      //    ignore = true;
      //  };
   
   if(showTables==true){
     setShow(true)
   }
      console.log("heyyy")
    });
  }
}, [showTables]);


const handleProductSelection = (product) => {

  console.log("hi")

  if (selectedProducts.includes(product)) {
    setSelectedProducts(selectedProducts.filter(p => p !== product));
  } else {
    setSelectedProducts([...selectedProducts, product]);
  }
};

// const handleShowTables = () => {
//   console.log(showTables)
//   console.log(show)
//   availableProducts.forEach(product => {

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

//         table = worker.table(tableData);
// })
//   setShowTables(true);

//   console.log(showTables)
//   console.log(show)
// };

const handleHideTables = () => {
  console.log(showTables)
  console.log(show)
  setSelectedProducts([]);
  setShowTables(false);
  setShow(false);
};

const filteredProducts = showTables ? selectedProducts : [];
console.log(selectedProducts)

useEffect(()=>{
  
    selectedProducts.forEach(async (product) => {

        console.log("heyyy")
        let ignore = false;
        async function load() {
          if (ignore) {
            return;
          }
          console.log(table[product])

          await viewerRefs[product].current.load(await table[product]);
      }

      load();

        return () => {
          ignore = true;
        };
    })
    if(showTables==true){
      setShow(true)
    }
   // setShow(true)
 }, [showTables]);

 return (
  <div className="PerspectiveViewerRow">
    {show ? (
      <>
        <button onClick={handleHideTables}>Hide Tables</button>
        {selectedProducts.map(product => (
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


// import React, { useRef, useEffect, useState } from "react";
// import perspective from "@finos/perspective";
// import "@finos/perspective-viewer";
// import "@finos/perspective-viewer-datagrid";
// import "@finos/perspective-viewer-d3fc";
// import fileData from "./tableData.json";
// import "./styles.css";
// import axios from "axios";

// const dataUrls = [
//   { url: "./data.json"
//  }
// ];

// export function Perspective() {

//   const [selectedProducts, setSelectedProducts] = useState([]);
//   const [showTables, setShowTables] = useState(false);
//   let table = {};
//   let prodViewRef = useRef(null);
//   const columns = Object.keys(fileData);
//   const rows = [];
//   const viewerRefs = {};
//   const worker = perspective.worker();

//   fileData[columns[0]].forEach((value, index) => {
//     const row = {};
//     columns.forEach(column => {
//       row[column] = fileData[column][index];
//     });
//     rows.push(row);
//   });

// const pro = Array.from(new Set(rows.map(row => row["Product"])));
// const availableProducts = pro.slice(0, 5); // Take the first 2 products

// // Calculate the number of tables on the screen
// const tableCount = availableProducts.length; // Use the actual number of tables

// // Calculate the spacing between tables
// const tableSpacing = tableCount > 1 ? (100 - tableCount * 150) / (tableCount - 1) : 0;

// // Set the CSS custom properties with the calculated values
// document.documentElement.style.setProperty("--table-count", tableCount);
// document.documentElement.style.setProperty("--table-spacing", tableSpacing + "px");


// useEffect(() => { 
//   const intervalId = setInterval(() => {
//     const newData = {
//       "Bid": Math.random() * 10,
//       "Ask": Math.random() * 10
//     };

//     axios
//       .post("http://localhost:3000/append", newData)
//       .then(() => {
//         console.log("Data appended successfully");
//       })
//       .catch((error) => {
//         console.error("Error appending data:", error);
//       });
//   }, 3000);
  

//   return () => {
//     clearInterval(intervalId);
//   };
// }, []);

// useEffect(() => {

//   console.log("get req")

// availableProducts.forEach(product => {
  
//   const intervalId = setInterval(() => {

//     console.log(product)

//   axios.get("http://localhost:3000/api/data")
//   .then(async response => {

//     const data = response.data;
//     (await table).update(data, { mode: "add" });

//    const prodViewRef = useRef();
//     console.log(data);

//     let ignore = false;

//     async function load() {
//       if (ignore) {
//         return;
//       }
//       await prodViewRef.current.load(await table);
//     }
//     load();
//     viewerRefs[product]=prodViewRef;

//     return () => {
//       ignore = true;
//     };

//     })
//   .catch(error => {
//     console.error("Error fetching data:", error);
//   });
// }, 4000);

// return () => {
//   clearInterval(intervalId);
// };
// })
// }, []);


// //useEffect(()=>{
//   availableProducts.forEach(product => {

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

//     //  console.log("heyyy")

  
//      prodViewRef = useRef();
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
//   console.log("heyyy")
// })




//   return (
//     <div className="PerspectiveViewerRow">
//       {/* {showTables ? ( */}
//         <>
          
//           {availableProducts.map(product => (
//             <div key={product} className="PerspectiveViewer">
//               <div className="Pers"> <h5>{product}</h5></div>
             
//               <perspective-viewer ref={viewerRefs[product]} />
//             </div>
//           ))}
//         </>
//     </div>
//   );
// }

// export default Perspective;
