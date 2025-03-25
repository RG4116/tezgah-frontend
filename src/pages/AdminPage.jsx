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

  const API_URL = "https://tezgah-api.onrender.com";

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
    <div className="admin-container">
      <h2>🛠️ Admin Paneli</h2>

      <input
        type="text"
        placeholder="Ürün veya renk ara..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div style={{ marginTop: "15px" }}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={handleExcelUpload}>Excel Yükle</button>
      </div>

      <div className="products-grid">
        {filtered.map((product) => (
          <div key={product.id} className="product-card">
            <h4>{product.name}</h4>
            {product.colors.map((color) => (
              <div key={color.id} className="color-row">
                {editItem === color.id ? (
                  <>
                    <input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                    />
                    <input
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                    />
                    <input
                      value={newCurrency}
                      onChange={(e) => setNewCurrency(e.target.value)}
                    />
                    <button onClick={() => handleUpdate(color.id)}>✔</button>
                    <button onClick={() => setEditItem(null)}>✖</button>
                  </>
                ) : (
                  <>
                    <span>
                      {color.name} - {color.price} {color.currency}
                    </span>
                    <button onClick={() => handleEdit(color)}>Düzenle</button>
                    <button onClick={() => handleDelete(color.id)}>Sil</button>
                  </>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
