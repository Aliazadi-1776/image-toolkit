import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/app/App";
<<<<<<< HEAD
import "@/styles.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
=======
import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element #root was not found.");
}

ReactDOM.createRoot(rootElement).render(
>>>>>>> e2cf61b00c4b93804c91a2f10e49509b357c3b76
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
