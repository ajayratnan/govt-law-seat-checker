import React from "react";
import ReactDOM from "react-dom/client";
import GovtLawCollegeSeatPredictor from "./GovtLawCollegeSeatPredictor";
import { Analytics } from "@vercel/analytics/react";
import "./index.css";   // Tailwind base styles

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GovtLawCollegeSeatPredictor />
      <Analytics />        {/* ← add */}
  </React.StrictMode>
);
