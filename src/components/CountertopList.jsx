import { useState } from "react";
import axios from "axios";

export default function CountertopForm({ onSuccess }) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:8000/countertops/", {
      name,
      color,
      price_per_sqft: parseFloat(price),
    })
    .then(() => {
      setName('');
      setColor('');
      setPrice('');
      onSuccess();
    })
    .catch(err => console.error(err));
  };

  return (
    <form className="border p-4 rounded" onSubmit={handleSubmit}>
      <h3 className="font-semibold mb-2">Yeni Tezgah Ekle</h3>

      <input type="text" placeholder="İsim"
        className="border p-2 my-2 w-full rounded"
        value={name} onChange={(e)=>setName(e.target.value)} required/>

      <input type="text" placeholder="Renk"
        className="border p-2 my-2 w-full rounded"
        value={color} onChange={(e)=>setColor(e.target.value)} required/>

      <input type="number" placeholder="Metrekare fiyatı"
        className="border p-2 my-2 w-full rounded"
        value={price} onChange={(e)=>setPrice(e.target.value)} required step="0.01"/>

      <button className="bg-blue-600 text-white rounded py-2 px-4 my-2">Ekle</button>
    </form>
  );
}
