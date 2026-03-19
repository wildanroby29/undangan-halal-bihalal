import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled, { createGlobalStyle, keyframes } from "styled-components";

// ==========================================
// 1. KONFIGURASI GAS LU
// ==========================================
const GAS_URL =
  "https://script.google.com/macros/s/AKfycbw5QWbHV3dliRS1Pnp9vo054B3y1gddA4KmrqkQl_6PgJ_McZpgZgbY6TNgHEciIV2EOg/exec";

const DAFTAR_TEMA = {
  putih: {
    bg: "#ffffff",
    gold: "#c4a74f",
    btnGrad: "linear-gradient(90deg, #C4A74F 0%, #967102 49%, #C4A74F 99%)",
  },
  hijau: {
    bg: "#042f2e",
    gold: "#c4a74f",
    btnGrad: "linear-gradient(90deg, #C4A74F 0%, #967102 49%, #C4A74F 99%)",
    titleGrad: "linear-gradient(180deg, #fef08a 0%, #c4a74f 50%, #967102 100%)",
  },
};

// --- ANIMASI & GLOBAL STYLE ---
const floating = keyframes` 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } `;

const GlobalStyle = createGlobalStyle`
  html, body, #root { margin: 0; padding: 0; width: 100%; height: 100%; overflow-x: hidden; background: ${(
    props
  ) => props.tema.bg}; }
  * { font-style: normal !important; box-sizing: border-box; font-family: sans-serif; outline: none !important; } 
  @import url('https://fonts.googleapis.com/css2?family=Lobster&display=swap');
`;

const Container = styled.div`
  width: 100%;
  max-width: 430px;
  min-height: 100vh;
  margin: 0 auto;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${(props) => props.tema.bg};
`;

const HeaderImg = styled(motion.img)`
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
`;
const FooterImg = styled(motion.img)`
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 1;
`;
const TopSection = styled(motion.div)`
  position: absolute;
  top: 160px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
  animation: ${floating} 4s ease-in-out infinite;
`;
const Title = styled.h1`
  font-family: "Lobster", cursive;
  font-size: 50px;
  margin: 5px 0;
  text-align: center;
  font-weight: 400;
  ${(props) =>
    props.temaActive === "hijau"
      ? `background: ${props.titleGrad}; -webkit-background-clip: text; -webkit-text-fill-color: transparent;`
      : `color: ${props.color};`}
`;
const GoldText = styled.p`
  color: ${(props) => props.tema.gold};
  margin: 0;
  text-align: center;
  font-size: ${(props) => props.size || "18px"};
  font-weight: ${(props) => props.weight || "400"};
`;
const PhotoFrame = styled(motion.div)`
  width: 320px;
  height: 180px;
  margin-bottom: 30px;
  border-radius: 12px;
  overflow: hidden;
  animation: ${floating} 5s ease-in-out infinite;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export default function App() {
  const [data, setData] = useState(null);
  const [to, setTo] = useState("Tamu Undangan");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const clientId = params.get("id");
    const name = params.get("to");
    if (name) setTo(decodeURIComponent(name));

    if (clientId) {
      fetch(`${GAS_URL}?id=${clientId}`)
        .then((res) => res.json())
        .then((res) => {
          if (!res.error) setData(res);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleRSVP = async (e) => {
    e.preventDefault();
    setSending(true);
    const formData = new FormData(e.target);
    try {
      await fetch(GAS_URL, { method: "POST", body: formData, mode: "no-cors" });
      alert("Terima Kasih, Konfirmasi Terkirim!");
      setShowForm(false);
    } catch (err) {
      alert("Gagal kirim data.");
    } finally {
      setSending(false);
    }
  };

  if (loading)
    return (
      <div
        style={{
          background: "#000",
          color: "#fff",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Memuat Database Aksara...
      </div>
    );
  if (!data)
    return (
      <div
        style={{
          background: "#000",
          color: "#fff",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        ID Undangan Tidak Valid.
      </div>
    );

  const style = DAFTAR_TEMA[data.tema] || DAFTAR_TEMA.putih;

  return (
    <>
      <GlobalStyle tema={style} />
      <Container tema={style}>
        {/* HEADER ASET */}
        <HeaderImg
          src={`asset/header-${data.tema}.png`}
          onError={(e) => {
            e.target.src = `header-${data.tema}.png`;
          }}
        />

        <TopSection>
          <GoldText size="26px" tema={style}>
            Undangan
          </GoldText>
          <Title
            tema={style}
            temaActive={data.tema}
            titleGrad={style.titleGrad}
            color={style.gold}
          >
            Halal Bihalal
          </Title>
          <GoldText size="16px" tema={style}>
            {data.instansi}
          </GoldText>
        </TopSection>

        <div
          style={{
            paddingTop: "350px",
            paddingBottom: "120px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 5,
          }}
        >
          <PhotoFrame>
            <img
              src={data.fotoUrl || `asset/foto-${data.tema}.png`}
              onError={(e) => {
                e.target.src = `foto-${data.tema}.png`;
              }}
              alt="Acara"
            />
          </PhotoFrame>

          <GoldText weight="bold" tema={style}>
            {data.tanggal}
          </GoldText>
          <GoldText size="14px" tema={style}>
            {data.jam}
          </GoldText>
          <GoldText size="14px" tema={style} style={{ marginBottom: "30px" }}>
            {data.lokasi}
          </GoldText>

          <GoldText size="14px" tema={style}>
            Kpd Yth:
          </GoldText>
          <GoldText
            size="22px"
            weight="bold"
            tema={style}
            style={{ marginBottom: "30px" }}
          >
            {to}
          </GoldText>

          <a
            href={data.mapsUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              width: "280px",
              height: "55px",
              borderRadius: "50px",
              border: `2px solid ${style.gold}`,
              color: style.gold,
              background: "white",
              textDecoration: "none",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "15px",
            }}
          >
            📍 Buka Lokasi Maps
          </a>

          <button
            onClick={() => setShowForm(true)}
            style={{
              width: "280px",
              height: "55px",
              borderRadius: "50px",
              border: "none",
              color: "#fff",
              fontSize: "16px",
              fontWeight: "bold",
              background: style.btnGrad,
              cursor: "pointer",
            }}
          >
            Konfirmasi Kehadiran
          </button>
        </div>

        {/* FOOTER ASET */}
        <FooterImg
          src={`asset/footer-${data.tema}.png`}
          onError={(e) => {
            e.target.src = `footer-${data.tema}.png`;
          }}
        />

        {/* MODAL RSVP */}
        <AnimatePresence>
          {showForm && (
            <div
              onClick={() => setShowForm(false)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.85)",
                zIndex: 999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: "90%",
                  maxWidth: "350px",
                  background: "white",
                  borderRadius: "20px",
                  padding: "25px",
                  border: `2px solid ${style.gold}`,
                }}
              >
                <GoldText
                  weight="bold"
                  size="20px"
                  style={{ marginBottom: "15px" }}
                  tema={style}
                >
                  Form RSVP
                </GoldText>
                <form onSubmit={handleRSVP}>
                  <input
                    name="nama"
                    defaultValue={to}
                    required
                    style={{
                      width: "100%",
                      padding: "12px",
                      margin: "8px 0",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                    }}
                    placeholder="Nama"
                  />
                  <select
                    name="kehadiran"
                    required
                    style={{
                      width: "100%",
                      padding: "12px",
                      margin: "8px 0",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                    }}
                  >
                    <option value="Hadir">Hadir</option>
                    <option value="Berhalangan">Berhalangan</option>
                  </select>
                  <input
                    name="jumlah"
                    type="number"
                    min="1"
                    placeholder="Jumlah Orang"
                    required
                    style={{
                      width: "100%",
                      padding: "12px",
                      margin: "8px 0",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                    }}
                  />
                  <button
                    type="submit"
                    disabled={sending}
                    style={{
                      width: "100%",
                      height: "45px",
                      marginTop: "10px",
                      background: style.btnGrad,
                      border: "none",
                      color: "#fff",
                      borderRadius: "50px",
                      fontWeight: "bold",
                    }}
                  >
                    {sending ? "Mengirim..." : "Kirim Konfirmasi"}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </Container>
    </>
  );
}
