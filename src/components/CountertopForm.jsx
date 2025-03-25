import { useState } from "react";
import axios from "axios";

export default function CountertopForm() {
  const [name,setName]=useState("");
  const [color,setColor]=useState("");
  const [price,setPrice]=useState("");

  const handleSubmit=e=>{
    e.preventDefault();
    axios.post("http://localhost:8000/countertops/", {name,color,price_per_sqft:price})
    .then(()=>window.location.reload());
  }

  return (
    <form onSubmit={handleSubmit}>
      <input required placeholder="İsim" onChange={(e)=>setName(e.target.value)} className="border p-2 rounded"/>
      <input required placeholder="Renk" onChange={(e)=>setColor(e.target.value)} className="border p-2 rounded"/>
      <input required placeholder="Fiyat" type="number" step="0.01" onChange={(e)=>setPrice(e.target.value)} className="border p-2 rounded"/>
      <button className="bg-green-500 text-white rounded p-2">Ekle</button>
    </form>
  )
}
