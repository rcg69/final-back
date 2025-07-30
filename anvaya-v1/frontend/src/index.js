import React from "react";
import ReactDOM from "react-dom/client"; // React 18 new root API
import App from "./App";
import "./App.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
