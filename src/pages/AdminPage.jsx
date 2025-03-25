import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminPage = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [file, setFile] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newCurrency, setNewCurrency] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/products/`);
      setProducts(res.data);
    } catch (err) {
      console.error("Veri alınamadı", err);
    }
  };

  useEffect(() => {
    if (search.trim()) {
      fetchData();
    } else {
      setFiltered([]);
    }
  }, [search]);

  useEffect(() => {
    const lower = search.toLowerCase();
    const result = products.filter((product) =>
      product.name.toLowerCase().includes(lower)
    );
    setFiltered(result);
  }, [search, products]);

  const handleExcelUpload = async () => {
    if (!file) return alert("Lütfen bir dosya seçin.");
    const formData = new FormData();
    formData.append("file", file);
    try {
      await axios.post(`${API_URL}/upload-excel/`, formData);
      alert("Excel başarıyla yüklendi!");
      fetchData();
    } catch (err) {
      alert("Excel yüklenirken hata oluştu.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/colors/${id}`);
      fetchData();
    } catch (err) {
      alert("Silme başarısız!");
    }
  };

  const handleEdit = (color) => {
    setEditItem(color.id);
    setNewName(color.name);
    setNewPrice(color.price);
    setNewCurrency(color.currency);
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(`${API_URL}/colors/${id}`, {
        name: newName,
        price: parseFloat(newPrice),
        currency: newCurrency,
      });
      setEditItem(null);
      fetchData();
    } catch (err) {
      alert("Güncelleme başarısız!");
    }
  };

  return (
    <div className="admin-page" style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>🛠️ Admin Paneli</h2>

      {/* Arama Kutusu */}
      <input
        type="text"
        placeholder="Ürün veya renk ara..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
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
      <div style={{ marginTop: "15px" }}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={handleExcelUpload}>Excel Yükle</button>
      </div>

      {/* Ürünler Listesi */}
      <div className="product-list" style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginTop: "2rem" }}>
        {filtered.map((product) => (
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
                  {editItem === color.id ? (
                    <>
                      <input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        style={{ marginRight: "5px" }}
                      />
                      <input
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        style={{ marginRight: "5px", width: "60px" }}
                      />
                      <input
                        value={newCurrency}
                        onChange={(e) => setNewCurrency(e.target.value)}
                        style={{ marginRight: "5px", width: "60px" }}
                      />
                      <button onClick={() => handleUpdate(color.id)} style={{
                        marginRight: "4px",
                        backgroundColor: "#5cb85c",
                        color: "white",
                        padding: "0.3rem 0.6rem",
                        border: "none",
                        borderRadius: "4px"
                      }}>✔</button>
                      <button onClick={() => setEditItem(null)} style={{
                        backgroundColor: "#999",
                        color: "white",
                        padding: "0.3rem 0.6rem",
                        border: "none",
                        borderRadius: "4px"
                      }}>✖</button>
                    </>
                  ) : (
                    <>
                      <div>
                        <strong>{color.name}</strong> – {color.price} {color.currency}
                      </div>
                      <div>
                        <button
                          onClick={() => handleEdit(color)}
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
