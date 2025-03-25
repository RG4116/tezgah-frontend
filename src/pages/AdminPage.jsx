import React, { useState } from "react";
import { Container, Table, Button, Form, Modal } from "react-bootstrap";
import axios from "axios";
import ExcelUpload from "../components/ExcelUpload";
import { FaFileExcel } from "react-icons/fa";

function AdminPage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedPrice, setEditedPrice] = useState("");
  const [editedCurrency, setEditedCurrency] = useState("₺");

  const fetchProducts = (searchTerm) => {
    if (!searchTerm.trim()) {
      setProducts([]);
      return;
    }

    axios.get("http://localhost:8000/products/")
      .then(res => {
        const filteredProducts = res.data.filter(product =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.colors.some(color => color.name.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setProducts(filteredProducts);
      })
      .catch(err => console.error("API'den veri çekerken hata oluştu:", err));
  };

  const confirmDelete = (type, id) => {
    setDeleteTarget({ type, id });
    setShowConfirm(true);
  };

  const deleteItem = () => {
    if (deleteTarget) {
      if (deleteTarget.type === "product") {
        axios.delete(`http://localhost:8000/products/${deleteTarget.id}`)
          .then(() => fetchProducts(searchTerm))
          .catch(err => console.error("Ürün silinirken hata oluştu:", err));
      } else if (deleteTarget.type === "color") {
        axios.delete(`http://localhost:8000/colors/${deleteTarget.id}`)
          .then(() => fetchProducts(searchTerm))
          .catch(err => console.error("Renk silinirken hata oluştu:", err));
      }
      setShowConfirm(false);
    }
  };

  const openEditModal = (type, item) => {
    setEditItem({ type, ...item });
    setEditedName(item.name);
    setEditedPrice(item.price || "");
    setEditedCurrency(item.currency || "₺");
    setShowEditModal(true);
  };

  // ✅ GÜNCELLENEN KISIM (product_id kaldırıldı)
  const saveChanges = () => {
    if (editItem.type === "product") {
      axios.put(`http://localhost:8000/products/${editItem.id}`, { name: editedName })
        .then(() => fetchProducts(searchTerm))
        .catch(err => console.error("Ürün güncellenirken hata oluştu:", err));
    } else if (editItem.type === "color") {
      axios.put(`http://localhost:8000/colors/${editItem.id}`, {
        name: editedName,
        price: parseFloat(editedPrice),
        currency: editedCurrency // product_id artık gönderilmiyor
      })
      .then(() => {
        fetchProducts(searchTerm);
      })
      .catch(err => console.error("Renk güncellenirken hata oluştu:", err));
    }
    setShowEditModal(false);
  };

  return (
    <Container className="mt-5">
      <h2>🔧 Admin Paneli</h2>

      <Form className="mb-4">
        <Form.Control
          type="text"
          placeholder="Ürün veya renk ara..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            fetchProducts(e.target.value);
          }}
          className="custom-focus"
        />
      </Form>

      {products.length > 0 && (
        <>
          <h4>Arama Sonuçları</h4>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Ürün Adı</th>
                <th>Renkler ve Fiyatlar</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    {product.name}
                    <Button variant="warning" size="sm" className="ms-2" onClick={() => openEditModal("product", product)}>
                      Düzenle
                    </Button>
                    <Button variant="danger" size="sm" className="ms-2" onClick={() => confirmDelete("product", product.id)}>
                      Ürünü Sil
                    </Button>
                  </td>
                  <td>
                    {product.colors.length > 0
                      ? product.colors.map((color) => (
                          <div key={color.id}>
                            {color.name} - {color.price} {color.currency}
                            <Button
                              variant="warning"
                              size="sm"
                              className="ms-2"
                              onClick={() => openEditModal("color", color)}
                            >
                              📝
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              className="ms-2"
                              onClick={() => confirmDelete("color", color.id)}
                            >
                              ❌
                            </Button>
                          </div>
                        ))
                      : "Renk Yok"}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}

      <ExcelUpload onUploadSuccess={() => fetchProducts(searchTerm)} />

      <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
        <Modal.Body>Bu öğeyi silmek istediğinizden emin misiniz?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>İptal</Button>
          <Button variant="danger" onClick={deleteItem}>Sil</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Adı</Form.Label>
              <Form.Control type="text" value={editedName} onChange={(e) => setEditedName(e.target.value)} />
            </Form.Group>
            {editItem?.type === "color" && (
              <>
                <Form.Group>
                  <Form.Label>Fiyat</Form.Label>
                  <Form.Control 
                    type="number" 
                    value={editedPrice} 
                    onChange={(e) => {
                      if (!isNaN(e.target.value)) { // ✅ Sayısal değer kontrolü
                        setEditedPrice(e.target.value);
                      }
                    }} 
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Para Birimi</Form.Label>
                  <Form.Select value={editedCurrency} onChange={(e) => setEditedCurrency(e.target.value)}>
                    <option value="₺">₺</option>
                    <option value="$">$</option>
                    <option value="€">€</option>
                  </Form.Select>
                </Form.Group>
              </>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>İptal</Button>
          <Button variant="primary" onClick={saveChanges}>Kaydet</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default AdminPage;