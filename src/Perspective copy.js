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

console.log(jsonData)
const dataUrls = [
  { url: "./data.json"
 }
];

export function Perspective() {
  const viewerRef = useRef();

  const [selectedDataUrl, setSelectedDataUrl] = useState(dataUrls[0]);

  const worker = perspective.worker();

      const table = worker.table(fileData , {
        limit: 10     ,
    });
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

// window.addEventListener("load", async () => {
//   let req = await fetch("./layout.json");
//   let layout = await req.json();

//   window.workspace.tables.set("movies", datasource());

//   window.workspace.restore(layout);
// });

useEffect(() => {
  const intervalId = setInterval(() => {
    const newData = 
      {"Name": "Aisha", "Age": Math.random()*10, "Country": "India"};

    axios
      .post("http://localhost:3000/append", newData)
      .then(() => {
        console.log("Data appended successfully");
      })
      .catch((error) => {
        console.error("Error appending data:", error);
      });
  }, 50);
  

  return () => {
    clearInterval(intervalId);
  };
}, []);

useEffect(() => {
  const intervalId = setInterval(() => {

  // axios.get("http://localhost:3000/api/data")
  axios.get("http://localhost:3000/api/data")
  .then(async response => {
    const data = response.data;
    (await table).update(data, { mode: "add" });
    console.log(data);
    })
  .catch(error => {
    console.error("Error fetching data:", error);
  });
}, 100);

return () => {
  clearInterval(intervalId);
};
}, []);

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
