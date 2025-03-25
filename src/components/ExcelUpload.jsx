import React, { useState } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";

function ExcelUpload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Lütfen bir dosya seçin!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("http://localhost:8000/upload-excel/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Excel başarıyla yüklendi!");
      onUploadSuccess(); // Başarıyla yüklenince verileri güncelle
    } catch (error) {
      console.error("Excel yüklenirken hata oluştu:", error);
      alert("Excel yüklenirken hata oluştu.");
    }
  };

  return (
    <div className="mt-4">
      <h4>Excel Dosyası Yükle</h4>
      <Form.Group>
        <Form.Control type="file" accept=".xlsx" onChange={handleFileChange} />
      </Form.Group>
      <Button variant="primary" className="mt-2" onClick={handleUpload}>
        Excel Yükle
      </Button>
    </div>
  );
}

export default ExcelUpload;
