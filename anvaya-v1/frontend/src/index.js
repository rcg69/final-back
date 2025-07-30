import React from "react";
import ReactDOM from "react-dom/client"; // Not "react-dom"
import App from "./App";
// In index.js or App.js
import './App.css'; 

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
