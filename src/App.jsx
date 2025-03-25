import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";
import CalculatorPage from "./pages/CalculatorPage";
import { ThemeContext, ThemeProvider } from "./context/ThemeContext";

function AppContent() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <Router>
      <Navbar bg={theme === "dark" ? "dark" : "light"} variant={theme === "dark" ? "dark" : "light"}>
        <Container>
          <Navbar.Brand href="/">Tezgah Uygulaması</Navbar.Brand>
          <Nav className="ml-auto">
            <Nav.Link href="/">Ana Sayfa</Nav.Link>
            <Nav.Link href="/admin">Admin Paneli</Nav.Link>
            <Nav.Link href="/calculator">Hesaplama</Nav.Link>
            <Button
              onClick={toggleTheme}
              style={{
                marginLeft: "1rem",
                background: theme === "light" ? "#222" : "#eee",
                color: theme === "light" ? "#fff" : "#111",
                border: "none",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
              }}
            >
              {theme === "light" ? "🌙" : "☀️"}
            </Button>
          </Nav>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/calculator" element={<CalculatorPage />} />
        </Routes>
      </Container>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;