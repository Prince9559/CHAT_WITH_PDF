import "./App.css";
import { useState } from "react";

import Navbar from "./components/Navbar/Navbar";
import UploadPDF from "./components/UploadPDF/UploadPDF";
import Chat from "./components/Chat/Chat";

function App() {

  const [pdfUploaded, setPdfUploaded] = useState(false);

  return (
    <div className="App">
      <Navbar />

      <UploadPDF setPdfUploaded={setPdfUploaded} />

      <Chat pdfUploaded={pdfUploaded} />
    </div>
  );
}

export default App;