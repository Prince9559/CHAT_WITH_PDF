import "./UploadPDF.css";
import axios from "axios";

const API = "https://chat-with-pdf-t5h4.onrender.com/api";

function UploadPDF({ setPdfUploaded }) {

    async function handleFile(e) {

        const file = e.target.files[0];

        if (!file) return;

        try {

            const formData = new FormData();
            formData.append("pdf", file);

            const { data } = await axios.post(`${API}/upload`, formData);

            alert(data.message);

            setPdfUploaded(true);

        } catch (err) {
            console.error(err);
            alert("Upload Failed");
        }
    }

    return (
        <div className="upload-container">
            <input
                type="file"
                accept="application/pdf"
                onChange={handleFile}
            />
        </div>
    );
}

export default UploadPDF;