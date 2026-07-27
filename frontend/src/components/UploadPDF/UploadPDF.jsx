import "./UploadPDF.css";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

const API = "https://chat-with-pdf-t5h4.onrender.com/api";

function UploadPDF({ setPdfUploaded }) {

    const [fileName, setFileName] = useState("");

    async function handleFile(e) {

        const file = e.target.files[0];

        if (!file) return;

        setFileName(file.name);

        try {

            const formData = new FormData();
            formData.append("pdf", file);

            const { data } = await axios.post(`${API}/upload`, formData);

            toast.success("📄 PDF Uploaded Successfully");

setPdfUploaded(true);

        } catch (err) {

    console.error(err);

    toast.error("❌ Upload Failed");

    setPdfUploaded(false);

}

    }

    return (

        <div className="upload-container">

            <label className="upload-box">

                📄 Choose PDF

                <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFile}
                    hidden
                />

            </label>

            {fileName && (
             <p className="file-name">
              📄 {fileName}
              </p>
            )}

        </div>

    );

}

export default UploadPDF;