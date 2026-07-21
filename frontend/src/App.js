import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import UploadPDF from "./components/UploadPDF/UploadPDF";
import Chat from "./components/Chat/Chat";
import { useState } from "react";

function App() {

  const [pdfUploaded, setPdfUploaded] = useState(false);

  return (
    <div className="App">

      <Navbar />

      <UploadPDF
        pdfUploaded={pdfUploaded}
        setPdfUploaded={setPdfUploaded}
      />

      <Chat
        pdfUploaded={pdfUploaded}
      />

    </div>
  );
}

export default App;