import "./App.css";
import { useState } from "react";
import ToastProvider from "./components/Toast/ToastProvider";
import Navbar from "./components/Navbar/Navbar";
import UploadPDF from "./components/UploadPDF/UploadPDF";
import Chat from "./components/Chat/Chat";
import ThemeToggle from "./components/ThemeToggle/ThemeToggle";

function App() {

    const [darkMode, setDarkMode] = useState(false);
    const [pdfUploaded, setPdfUploaded] = useState(false);

    return (
        <div className={darkMode ? "App dark" : "App"}>
            <Navbar />
            <UploadPDF setPdfUploaded={setPdfUploaded} />
            <Chat pdfUploaded={pdfUploaded} />
            <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode}/>
            <ToastProvider />
        </div>
    );
}

export default App;