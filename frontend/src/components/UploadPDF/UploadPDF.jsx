
import "./UploadPDF.css";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

const API = "https://chat-with-pdf-t5h4.onrender.com/api";

function UploadPDF({ setPdfUploaded }) {
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleFile(e) {
    const file = e.target.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please select a valid PDF file");
      return;
    }

    setFileName(file.name);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("pdf", file);

      const response = await axios.post(
        `${API}/upload`,
        formData,
        { timeout: 300000 }
      );

      console.log("Upload response:", response.data);

      toast.success("PDF uploaded successfully!");
      setPdfUploaded(true);

    } catch (err) {
      console.error("PDF Upload Error:", err.response?.data || err.message);

      toast.error(
        err.response?.data?.message || "PDF upload failed. Please try again."
      );

      setPdfUploaded(false);

    } finally {
      setLoading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="upload-container">
      <label className="upload-box">
        {loading ? "⏳ Uploading PDF..." : "📄 Choose PDF"}

        <input
          type="file"
          accept="application/pdf"
          onChange={handleFile}
          disabled={loading}
          hidden
        />
      </label>

      {fileName && (
        <p className="file-name">📄 {fileName}</p>
      )}

      {loading && <p>Please wait while your PDF is processing...</p>}
    </div>
  );
}

export default UploadPDF;
