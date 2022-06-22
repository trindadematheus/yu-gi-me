import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");

  async function handleCreateCard() {
    const formData = new FormData();

    formData.append("avatar", file);
    formData.append("name", name);

    try {
      const { data } = await axios.post("/api", formData, {
        responseType: "blob",
      });

      const file = new Blob([data], { type: "image/jpg" });
      const blobUrl = URL.createObjectURL(file);

      window.open(blobUrl);
    } catch (error) {
      alert("error, please insert all data on form");
      console.log({ error });
    }
  }

  return (
    <>
      <h1>Card Maker 2022</h1>

      <label htmlFor="">insert your photo: </label>
      <br />
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        placeholder="insert your photo"
        required
      />
      <br />
      <br />
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="insert your name"
        required
      />

      <br />
      <br />
      <button onClick={handleCreateCard}>Enviar</button>
    </>
  );
}
