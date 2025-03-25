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
    <div className="admin-container">
      <h2 className="page-title">🛠️ Admin Paneli</h2>

      <div className="controls-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Ürün veya renk ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="file-controls">
          <input
            type="file"
            accept=".xlsx"
            onChange={handleFileChange}
            className="file-input"
          />
          <button onClick={handleUpload} className="upload-button">
            Excel Yükle
          </button>
        </div>
      </div>

      <div className="products-grid">
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-card">
            <h3 className="product-title">{product.name}</h3>
            {product.colors.length === 0 ? (
              <p className="no-color">Renk yok</p>
            ) : (
              product.colors.map((color) => (
                <div key={color.id} className="color-item">
                  {editColor?.id === color.id ? (
                    <div className="edit-mode">
                      <div className="input-group">
                        <input
                          value={editColor.name}
                          onChange={(e) => handleEditChange(e, "name")}
                          className="edit-input"
                        />
                        <input
                          value={editColor.price}
                          onChange={(e) => handleEditChange(e, "price")}
                          type="number"
                          className="edit-input"
                        />
                        <input
                          value={editColor.currency}
                          onChange={(e) => handleEditChange(e, "currency")}
                          className="edit-input currency"
                        />
                      </div>
                      <button onClick={saveEdit} className="save-button">
                        Kaydet
                      </button>
                    </div>
                  ) : (
                    <div className="view-mode">
                      <div className="color-info">
                        <strong>{color.name}</strong> – {color.price} {color.currency}
                      </div>
                      <div className="button-group">
                        <button
                          onClick={() => setEditColor(color)}
                          className="edit-button"
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() => handleDelete(color.id)}
                          className="delete-button"
                        >
                          Sil
                        </button>
                      </div>
                    </div>
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
