import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Card, Button } from "react-bootstrap";
import axios from "axios";

function CalculatorPage() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [colors, setColors] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [price, setPrice] = useState("");
  const [thicknessOptions, setThicknessOptions] = useState([]);
  const [selectedThickness, setSelectedThickness] = useState("h:4 cm");
  

  const [depths, setDepths] = useState([{ depth: "", meter: "", price: "" }]);
  const depthOptions = [
    "65 cm'ye kadar",
    "70 cm",
    "80 cm",
    "90 cm",
    "100 cm",
    "110 cm",
    "120 cm"
  ];

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/products/`)
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Ürünler yüklenirken hata oluştu:", error));
  }, []);

  const handleProductChange = (event) => {
    const productId = event.target.value;
    setSelectedProduct(productId);
    setSelectedColor("");
    setPrice("");

    if (productId) {
      const product = products.find((p) => p.id.toString() === productId);
      if (product) {
        setColors(product.colors);

        const productName = product.name.toLowerCase();
        const commonThickness = ["h:4 cm", "h:5-6 cm", "h:7-8 cm", "h:9-10 cm", "h:11-15 cm", "h:16-20 cm"];
        let baseThickness;

        if (["belenco", "belenco-seta", "lamar"].includes(productName)) {
          baseThickness = ["h:1.5 cm"];
        } else if (["çimstone", "coante"].includes(productName)) {
          baseThickness = ["h:2 cm"];
        } else {
          baseThickness = ["h:1.2 cm"];
        }

        const thicknessList = [...baseThickness, ...commonThickness];
        setThicknessOptions(thicknessList);
        setSelectedThickness("h:4 cm");
      } else {
        setColors([]);
        setThicknessOptions([]);
      }
    } else {
      setColors([]);
      setThicknessOptions([]);
    }
  };

  const handleColorChange = (event) => {
    const colorName = event.target.value;
    setSelectedColor(colorName);
    const selectedColorData = colors.find((c) => c.name === colorName);
    setPrice(selectedColorData ? `${selectedColorData.price} ${selectedColorData.currency}` : "");
  };

  const handleDepthChange = (index, field, value) => {
    const updatedDepths = [...depths];
    updatedDepths[index][field] = value;
    setDepths(updatedDepths);
  };

  const addDepthField = () => {
    if (depths.length < 5) {
      setDepths([...depths, { depth: "", meter: "" }]);
    }
  };

  const removeDepthField = () => {
    if (depths.length > 1) {
      setDepths(depths.slice(0, -1));
    }
  };

  return (
    <Container className="mt-5 px-3">
      <h2 className="text-center fw-bold mb-4">🛠️ Tezgah Hesaplama</h2>

      {/* Firma Bilgileri */}
      <Card className="p-4 shadow-sm mb-4">
        <Row className="gy-3">
          <Col xs={12} md={6} lg={3}><Form.Control placeholder="Firma / Bayi" className="rounded shadow-sm custom-focus" /></Col>
          <Col xs={12} md={6} lg={3}><Form.Control placeholder="Müşteri" className="rounded shadow-sm custom-focus" /></Col>
          <Col xs={12} md={6} lg={3}><Form.Control placeholder="Mimar" className="rounded shadow-sm custom-focus" /></Col>
          <Col xs={12} md={6} lg={3}><Form.Control type="date" className="rounded shadow-sm custom-focus" /></Col>
        </Row>
      </Card>

      {/* Ürün ve Renk Seçimi */}
      <Card className="p-4 shadow-sm">
        <Row className="gy-3">
          <Col xs={12} md={3}>
            <Form.Group>
              <Form.Label className="fw-semibold">Ürün Seç</Form.Label>
              <Form.Select value={selectedProduct} onChange={handleProductChange} className="rounded shadow-sm custom-focus">
                <option value="">Ürün Seç</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>{product.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          {selectedProduct && colors.length > 0 && (
            <Col xs={12} md={3}>
              <Form.Group>
                <Form.Label className="fw-semibold">Renk Seç</Form.Label>
                <Form.Select value={selectedColor} onChange={handleColorChange} className="rounded shadow-sm custom-focus">
                  <option value="">Renk Seç</option>
                  {colors.map((color) => (
                    <option key={color.id} value={color.name}>{color.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          )}

          {selectedProduct && (
            <Col xs={12} md={3}>
              <Form.Group>
                <Form.Label className="fw-semibold">Tezgah Ön Kalınlık (h)</Form.Label>
                <Form.Select value={selectedThickness} onChange={(e) => setSelectedThickness(e.target.value)} className="rounded shadow-sm custom-focus">
                  {thicknessOptions.map((thickness, index) => (
                    <option key={index} value={thickness}>{thickness}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          )}

          {selectedColor && (
            <Col xs={12} md={3}>
              <Form.Group>
                <Form.Label className="fw-semibold">Fiyat</Form.Label>
                <Form.Control type="text" value={price} disabled className="rounded shadow-sm custom-focus" />
              </Form.Group>
            </Col>
          )}
        </Row>
      </Card>

      {/* Derinlik Bilgisi */}
      
<Card className="p-4 shadow-sm mt-4">
  <Form.Label className="fw-semibold">Projenizde kaç farklı derinlik var?</Form.Label>

  {depths.map((depthItem, index) => (
    <Row key={index} className="align-items-center gy-2 mb-2">
    <Col xs={12} md={4}>
      <Form.Group>
        <Form.Label className="fw-semibold">Derinlik</Form.Label>
        <Form.Select
          value={depthItem.depth}
          onChange={(e) => handleDepthChange(index, "depth", e.target.value)}
          className="rounded shadow-sm custom-focus"
        >
          <option value="">Derinlik Belirtiniz</option>
          {depthOptions.map((depth, idx) => (
            <option key={idx} value={depth}>{depth}</option>
          ))}
        </Form.Select>
      </Form.Group>
    </Col>
  
    <Col xs={12} md={4}>
      <Form.Group>
        <Form.Label className="fw-semibold">Metre Tül</Form.Label>
        <Form.Control
          type="text"
          placeholder="ör. 5.25"
          value={depthItem.meter}
          onChange={(e) => handleDepthChange(index, "meter", e.target.value)}
          className="rounded shadow-sm custom-focus"
        />
      </Form.Group>
    </Col>
  
    <Col xs={12} md={4}>
      <Form.Group>
        <Form.Label className="fw-semibold">Fiyat</Form.Label>
        <Form.Control
          type="text"
          value={depthItem.price || ""}
          onChange={(e) => handleDepthChange(index, "price", e.target.value)}
          className="rounded shadow-sm custom-focus"
        />
      </Form.Group>
    </Col>
  </Row>
  
  ))}

  <div className="d-flex gap-2 mt-3">
    <Button onClick={addDepthField} disabled={depths.length >= 5} variant="success">+</Button>
    <Button onClick={removeDepthField} disabled={depths.length <= 1} variant="danger">–</Button>
  </div>
</Card>

    </Container>
  );
}

export default CalculatorPage;
