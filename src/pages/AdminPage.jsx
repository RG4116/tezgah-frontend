import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminPage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [file, setFile] = useState(null);
  const [editColor, setEditColor] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/products/`);
      setProducts(response.data);
    } catch (error) {
      console.error("Ürünler alınamadı:", error);
    }
  };

  useEffect(() => {
    if (searchTerm.trim()) {
      fetchProducts();
    } else {
      setProducts([]);
    }
  }, [searchTerm]);

  const handleDelete = async (colorId) => {
    const confirmed = window.confirm("Bu rengi silmek istediğinizden emin misiniz?");
    if (!confirmed) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/colors/${colorId}`);
      fetchProducts();
    } catch (error) {
      console.error("Silme işlemi başarısız:", error);
    }
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return alert("Lütfen bir dosya seçin!");
    const formData = new FormData();
    formData.append("file", file);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/upload-excel/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Excel başarıyla yüklendi!");
      fetchProducts();
    } catch (error) {
      alert("Excel yüklenirken hata oluştu.");
    }
  };

  const handleEditChange = (e, field) => {
    setEditColor({ ...editColor, [field]: e.target.value });
  };

  const saveEdit = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/colors/${editColor.id}`, {
        name: editColor.name,
        price: parseFloat(editColor.price),
        currency: editColor.currency
      });
      setEditColor(null);
      fetchProducts();
    } catch (error) {
      alert("Güncelleme başarısız.");
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.colors.some((color) =>
      color.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>🛠️ Admin Paneli</h2>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "1rem" }}>
        <input
          type="text"
          placeholder="Ürün veya renk ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "0.6rem 1rem",
            width: "250px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "1rem",
            textAlign: "center"
          }}
        />
        <input
          type="file"
          accept=".xlsx"
          onChange={handleFileChange}
          style={{
            padding: "0.6rem",
            border: "1px solid #ccc",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
            fontSize: "0.95rem"
          }}
        />
        <button
          onClick={handleUpload}
          style={{
            padding: "0.6rem 1.2rem",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            cursor: "pointer"
          }}
        >
          Excel Yükle
        </button>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginTop: "2rem" }}>
        {filteredProducts.map((product) => (
          <div key={product.id} style={{
            flex: "1 1 300px",
            border: "1px solid #eee",
            borderRadius: "10px",
            padding: "1rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
          }}>
            <h3 style={{ marginBottom: "0.5rem", borderBottom: "1px solid #ccc", paddingBottom: "0.4rem" }}>
              {product.name}
            </h3>
            {product.colors.length === 0 ? (
              <p>Renk yok</p>
            ) : (
              product.colors.map((color) => (
                <div key={color.id} style={{
                  marginBottom: "0.5rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  {editColor?.id === color.id ? (
                    <>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <input
                          value={editColor.name}
                          onChange={(e) => handleEditChange(e, "name")}
                          style={{ width: "90px", padding: "0.2rem" }}
                        />
                        <input
                          value={editColor.price}
                          onChange={(e) => handleEditChange(e, "price")}
                          style={{ width: "60px", padding: "0.2rem" }}
                          type="number"
                        />
                        <input
                          value={editColor.currency}
                          onChange={(e) => handleEditChange(e, "currency")}
                          style={{ width: "40px", padding: "0.2rem" }}
                        />
                      </div>
                      <button onClick={saveEdit} style={{
                        padding: "0.3rem 0.6rem",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontSize: "0.85rem"
                      }}>Kaydet</button>
                    </>
                  ) : (
                    <>
                      <div>
                        <strong>{color.name}</strong> – {color.price} {color.currency}
                      </div>
                      <div>
                        <button
                          onClick={() => setEditColor(color)}
                          style={{
                            marginRight: "0.5rem",
                            padding: "0.3rem 0.6rem",
                            fontSize: "0.85rem",
                            backgroundColor: "#f0ad4e",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer"
                          }}
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() => handleDelete(color.id)}
                          style={{
                            padding: "0.3rem 0.6rem",
                            fontSize: "0.85rem",
                            backgroundColor: "#d9534f",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer"
                          }}
                        >
                          Sil
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
