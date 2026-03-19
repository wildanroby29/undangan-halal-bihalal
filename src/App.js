import React, { useState, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";

// URL GAS TERBARU LU
const GAS_URL = "https://script.google.com/macros/s/AKfycbzStL7c-wExxTlDljzEwy3yiGpXRWhMZGjk5nCRNGmJCBQOkTQWWRtAvCtTW2vfr-Lr5Q/exec";

const GlobalStyle = createGlobalStyle`
  body { margin: 0; padding: 0; background: #fff; }
  * { font-style: normal !important; box-sizing: border-box; font-family: 'sans-serif'; }
`;

export default function App() {
  const [data, setData] = useState(null);
  const [to, setTo] = useState("Tamu Undangan");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const clientId = params.get("id");
    const name = params.get("to");
    if (name) setTo(decodeURIComponent(name));

    if (clientId) {
      // Narik data pake ID dari URL
      fetch(`${GAS_URL}?id=${clientId}`)
        .then(res => res.json())
        .then(res => {
          if (!res.error) setData(res);
        })
        .catch(err => console.log("Error Database:", err));
    }
  }, []);

  // Tampilan nunggu data
  if (!data) return <div style={{ padding: '50px', textAlign: 'center' }}>Memuat Undangan Aksara...</div>;

  return (
    <>
      <GlobalStyle />
      <div style={{ width: '100%', maxWidth: '430px', margin: '0 auto', textAlign: 'center', minHeight: '100vh', position: 'relative', backgroundColor: data.tema === 'hijau' ? '#042f2e' : '#fff' }}>
        
        {/* Header Aset dari folder public/asset/ */}
        <img src={`/asset/header-${data.tema}.png`} style={{ width: '100%' }} alt="header" />

        <div style={{ padding: '20px', zIndex: 10, position: 'relative' }}>
          <h1 style={{ color: '#c4a74f', fontSize: '42px', margin: '10px 0' }}>Halal Bihalal</h1>
          <p style={{ color: data.tema === 'hijau' ? '#fff' : '#c4a74f', fontSize: '18px' }}>{data.instansi}</p>
          
          {/* Foto Acara */}
          <div style={{ margin: '20px auto', width: '90%', borderRadius: '15px', overflow: 'hidden', border: '3px solid #c4a74f' }}>
            <img src={data.fotourl || `/asset/foto-${data.tema}.png`} style={{ width: '100%', display: 'block' }} alt="foto" />
          </div>

          <div style={{ color: data.tema === 'hijau' ? '#fff' : '#444' }}>
            <p style={{ fontWeight: 'bold', fontSize: '20px', margin: '5px 0' }}>{data.tanggal}</p>
            <p style={{ fontSize: '14px' }}>Jam: {data.jam}</p>
            <p style={{ fontSize: '16px' }}>📍 {data.lokasi}</p>
          </div>

          <div style={{ marginTop: '30px' }}>
            <p style={{ color: '#c4a74f', marginBottom: '5px' }}>Kepada Yth:</p>
            <h2 style={{ color: data.tema === 'hijau' ? '#fff' : '#c4a74f', margin: '0' }}>{to}</h2>
          </div>

          {/* Tombol Aksi */}
          <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
            <a href={data.mapsurl} target="_blank" rel="noreferrer" style={{ width: '80%', padding: '15px', borderRadius: '50px', border: '2px solid #c4a74f', color: '#c4a74f', textDecoration: 'none', fontWeight: 'bold', background: '#fff' }}>
              📍 Buka Lokasi Maps
            </a>
            <button style={{ width: '80%', padding: '15px', borderRadius: '50px', border: 'none', color: '#fff', fontWeight: 'bold', background: 'linear-gradient(90deg, #C4A74F 0%, #967102 100%)', cursor: 'pointer' }}>
              Konfirmasi Kehadiran
            </button>
          </div>
        </div>

        {/* Footer Aset */}
        <img src={`/asset/footer-${data.tema}.png`} style={{ width: '100%', marginTop: '30px' }} alt="footer" />
      </div>
    </>
  );
}