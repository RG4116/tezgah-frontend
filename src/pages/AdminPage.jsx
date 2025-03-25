import React, { useEffect, useState } from "react";
import ExcelUpload from "../components/ExcelUpload";
import axios from "axios";

const AdminPage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/products/`);
      setProducts(response.data);
    } catch (error) {
      console.error("Ürünler alınamadı:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (colorId) => {
    const confirmed = window.confirm("Bu rengi silmek istediğinizden emin misiniz?");
    if (!confirmed) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/colors/${colorId}`);
      fetchProducts(); // refresh data
    } catch (error) {
      console.error("Silme işlemi başarısız:", error);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.colors.some((color) =>
      color.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="admin-page" style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>🛠️ Admin Paneli</h2>

      {/* Arama Kutusu */}
      <input
        type="text"
        placeholder="Ürün veya renk ara..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          padding: "0.6rem 1rem",
          width: "100%",
          maxWidth: "400px",
          marginBottom: "1.5rem",
          borderRadius: "8px",
          border: "1px solid #ccc",
          fontSize: "1rem"
        }}
      />

      {/* Excel Yükleme */}
      <ExcelUpload onUploadSuccess={fetchProducts} />

      {/* Ürünler Listesi */}
      <div className="product-list" style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginTop: "2rem" }}>
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-card" style={{
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
                  <div>
                    <strong>{color.name}</strong> – {color.price} {color.currency}
                  </div>
                  <div>
                    <button
                      onClick={() => alert("Düzenleme özelliği yakında aktif!")}
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
