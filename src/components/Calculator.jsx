import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Calculator() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/countertops/')
      .then(res => setItems(res.data));
  }, []);

  const calculate = () => {
    const item = items.find(i => i.id == selected);
    setResult((width * height) * item.price_per_sqft);
  };

  return (
    <div className="bg-gray-50 shadow-lg rounded-lg p-6">
      <select className="border p-3 rounded mb-3 w-full" onChange={e=>setSelected(e.target.value)}>
        <option hidden>Ürün seç</option>
        {items.map(i => <option value={i.id} key={i.id}>{i.name} ({i.color})</option>)}
      </select>
      <input placeholder="Genişlik (ft)" className="border p-2 w-full my-2 rounded" onChange={e=>setWidth(e.target.value)} type="number"/>
      <input placeholder="Uzunluk (ft)" className="border p-2 my-2 rounded" onChange={(e)=>setHeight(e.target.value)}/>
      <button className="bg-blue-500 text-white px-6 py-2 rounded" onClick={calculate}>Hesapla</button>
      {result && <div className="mt-4">Sonuç: ${result}</div>}
    </div>
  )
}
