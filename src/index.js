
import React from "react";
import ReactDOM from "react-dom/client";
import Line from './components/AuxiliaryLine/index'
import './index.css'
import MyPdf from './components/PdfPreview/index'

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <div className="main-container">
        <MyPdf className="pdf-container"> 
            {/* <Line  className="line-container"/> */}
        </MyPdf>
    </div>
);
