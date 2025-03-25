import React, { useState, useEffect } from "react";
import axios from "axios";
import ExcelUpload from "../components/ExcelUpload";
const API = import.meta.env.VITE_API_URL;

function AdminPage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // 🔄 API'den verileri al
  const fetchProducts = (term = "") => {
    axios
      .get(`${API}/products/`)
      .then((res) => {
        const filtered = term.trim()
          ? res.data.filter((product) =>
              product.name.toLowerCase().includes(term.toLowerCase()) ||
              product.colors.some((color) =>
                color.name.toLowerCase().includes(term.toLowerCase())
              )
            )
          : res.data; // 🔥 Arama boşsa tüm ürünleri göster

        setProducts(filtered);
      })
      .catch((err) => console.error("API'den veri alınamadı:", err));
  };

  // 🔃 Sayfa açılınca verileri getir
  useEffect(() => {
    fetchProducts();
  }, []);

  // 🔍 Arama kutusu
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    fetchProducts(term);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>

      <input
        type="text"
        placeholder="Ürün veya renk ara..."
        value={searchTerm}
        onChange={handleSearch}
        className="border p-2 rounded w-full mb-4"
      />

      <ExcelUpload onUploadSuccess={() => fetchProducts(searchTerm)} />

      <div className="mt-6">
        {products.map((product) => (
          <div key={product.id} className="border p-3 rounded mb-4 shadow">
            <h4 className="font-bold">{product.name}</h4>
            <ul className="ml-4 list-disc">
              {product.colors.map((color) => (
                <li key={color.id}>
                  {color.name} – {color.price} {color.currency}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPage;
