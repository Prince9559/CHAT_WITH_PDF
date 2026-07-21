import "./UploadPDF.css";
import { useState } from "react";

function UploadPDF({ pdfUploaded, setPdfUploaded }) {

    const [file, setFile] = useState(null);

    const handleFile = (e) => {

        setFile(e.target.files[0]);

    };

    const handleUpload = () => {

        if (!file) {

            alert("Select PDF First");

            return;

        }

        // API next step

        setPdfUploaded(true);

    };

    return (

        <div className="upload-container">

            <input
                type="file"
                accept=".pdf"
                onChange={handleFile}
            />

            <button
                onClick={handleUpload}
            >
                Upload PDF
            </button>

            {

                pdfUploaded &&

                <p>

                    ✅ PDF Uploaded

                </p>

            }

        </div>

    );

}

export default UploadPDF;