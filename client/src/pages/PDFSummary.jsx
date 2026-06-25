import React from "react";
import { useState } from "react";
import BASE_URL from "../lib/api.js";
const ReactMarkdown = React.lazy(() => import("react-markdown"));

const PDFSummary = () => {
  const [pdfFile, setPdfFile] = useState("");
  const [pdfResult, setPdfResult] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const handleChnagePdf = (e) => {
    setPdfFile(e.target.files[0]);
  };
  const handleSubmitPdf = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("pdf", pdfFile);
    const res = await fetch(`${BASE_URL}/api/pdf/analyze`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();

    setPdfResult(data.data.content);
  };
  return (
    <>
      <div>
        <input
          type="file"
          onChange={handleChnagePdf}
        />
        <button onClick={handleSubmitPdf}>
          {loading ? "Summarising" : "Upload & Summarize"}
        </button>
      </div>

      <div>
        <Markdown>{pdfResult}</Markdown>
      </div>
    </>
  );
};

export default PDFSummary;
