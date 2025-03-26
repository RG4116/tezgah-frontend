import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Form, Card, Button } from "react-bootstrap";

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
    <Container className="mt-5 px-3">
      <h2 className="text-center fw-bold mb-4">🛠️ Admin Paneli</h2>

      <Card className="p-4 shadow-sm mb-4">
        <Row className="gy-3 justify-content-center">
          <Col xs={12} md={4}>
            <Form.Control
              placeholder="Ürün veya renk ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded shadow-sm custom-focus text-center"
            />
          </Col>
          <Col xs={12} md={4}>
            <Form.Control
              type="file"
              accept=".xlsx"
              onChange={handleFileChange}
              className="rounded shadow-sm custom-focus"
            />
          </Col>
          <Col xs={12} md="auto">
            <Button onClick={handleUpload} className="shadow-sm">
              Excel Yükle
            </Button>
          </Col>
        </Row>
      </Card>

      <Row className="gy-4">
        {filteredProducts.map((product) => (
          <Col key={product.id} xs={12} md={6} lg={4}>
            <Card className="p-3 shadow-sm">
              <Card.Title className="border-bottom pb-2 mb-2">{product.name}</Card.Title>
              {product.colors.length === 0 ? (
                <p>Renk yok</p>
              ) : (
                product.colors.map((color) => (
                  <div key={color.id} className="d-flex justify-content-between align-items-center mb-2">
                    {editColor?.id === color.id ? (
                      <div className="w-100 d-flex gap-2">
                        <Form.Control
                          value={editColor.name}
                          onChange={(e) => handleEditChange(e, "name")}
                          size="sm"
                        />
                        <Form.Control
                          value={editColor.price}
                          onChange={(e) => handleEditChange(e, "price")}
                          size="sm"
                          type="number"
                        />
                        <Form.Control
                          value={editColor.currency}
                          onChange={(e) => handleEditChange(e, "currency")}
                          size="sm"
                        />
                        <Button variant="success" size="sm" onClick={saveEdit}>
                          Kaydet
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div>
                          <strong>{color.name}</strong> – {color.price} {color.currency}
                        </div>
                        <div>
                          <Button
                            size="sm"
                            variant="warning"
                            className="me-2"
                            onClick={() => setEditColor(color)}
                          >
                            Düzenle
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDelete(color.id)}
                          >
                            Sil
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default AdminPage;
