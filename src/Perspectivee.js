// import React, { useRef, useEffect, useState } from "react";
// import perspective from "@finos/perspective/dist/umd/perspective";
// import "@finos/perspective-viewer/dist/umd/material";
// import "@finos/perspective-viewer-datagrid/dist/umd/material";
// import "@finos/perspective-viewer-d3fc/dist/umd/material";

// export function Perspectivee() {
//   useEffect(() => {
//     const data = [
//       { x: 1, y: "a", z: true },
//       { x: 2, y: "b", z: false },
//       { x: 3, y: "c", z: true },
//       { x: 4, y: "d", z: false },
//     ];

//     const worker = perspective.worker();
//     const table = perspective.table(data);
//     console.log(table);

//     const viewer = document.createElement("perspective-viewer");
//     viewer.load(table);
//     document.body.appendChild(viewer);
//     return () => {
//       viewer.remove();
//     };
//   }, []);

//   return null;
// }

// export default Perspectivee;
