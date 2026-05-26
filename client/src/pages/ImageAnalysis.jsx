import React from "react";
import { useState } from "react";
import BASE_URL from "../lib/api.js";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

const ImageAnalysis = () => {
  const [selectedFile, setSelectedFile] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [imageAnalyze, setImageAnalyze] = useState("");
  const token = localStorage.getItem("token");

  const sendImage = async (formData) => {
    const res = await fetch(`${BASE_URL}/api/image/analyze`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();
    setImageAnalyze(data.data);
  };
  const handleChangeImage = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    const formData = new FormData();
    formData.append("image", file);
    console.log(formData);

    sendImage(formData);
    const tempURL = URL.createObjectURL(file);
    setPreviewUrl(tempURL);
  };
  return (
    <>
      <div>
        {!selectedFile && (
          <input
            type="file"
            onChange={handleChangeImage}
            accept="image/*"
          />
        )}
        {previewUrl && (
          <img
            src={previewUrl}
            alt=""
          />
        )}
      </div>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
      >
        {imageAnalyze}
      </ReactMarkdown>
      <div></div>
    </>
  );
};

export default ImageAnalysis;
