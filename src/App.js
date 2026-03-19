import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled, { createGlobalStyle, keyframes } from "styled-components";

// GANTI PAKE LINK DEPLOY TERBARU LU
const GAS_URL =
  "https://script.google.com/macros/s/AKfycbw6t4lwTB44zeqcAQhVaV1KHRZwb30QCupVB1HhiVQWf1M3cr1RCJn1t8qw6nlXFZGR_Q/exec";

const DAFTAR_TEMA = {
  putih: {
    bg: "#ffffff",
    gold: "#c4a74f",
    btnGrad: "linear-gradient(90deg, #C4A74F 0%, #967102 49%, #C4A74F 99%)",
    shadow: "rgba(150, 113, 2, 0.3)",
  },
  hijau: {
    bg: "#042f2e",
    gold: "#c4a74f",
    btnGrad: "linear-gradient(90deg, #C4A74F 0%, #967102 49%, #C4A74F 99%)",
    shadow: "rgba(196, 167, 79, 0.3)",
    titleGrad: "linear-gradient(180deg, #fef08a 0%, #c4a74f 50%, #967102 100%)",
  },
};

const shimmer = keyframes` 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } `;
const floating = keyframes` 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } `;

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Lobster&family=Poppins:wght@400;700&display=swap');
  html, body, #root { margin: 0; padding: 0; width: 100%; height: 100%; overflow-x: hidden; }
  * { font-style: normal !important; box-sizing: border-box; font-family: 'Poppins', sans-serif; } 
`;

const LoadingScreen = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fdfbf7;
  color: #c4a74f;
  .logo {
    font-family: "Lobster", cursive;
    font-size: 36px;
    margin-bottom: 20px;
  }
  .bar {
    width: 180px;
    height: 4px;
    background: #eee;
    border-radius: 10px;
    overflow: hidden;
  }
  .progress {
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, #eee 25%, #c4a74f 50%, #eee 75%);
    background-size: 200% 100%;
    animation: ${shimmer} 1.5s infinite;
  }
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
  background: ${(props) => props.bg};
  background-image: url(${(props) => props.bgImg});
  background-size: cover;
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

const Content = styled(motion.div)`
  padding-top: 160px;
  padding-bottom: 120px;
  z-index: 5;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-family: "Lobster", cursive;
  font-size: 48px;
  margin: 5px 0;
  font-weight: 400;
  ${(props) =>
    props.tema === "hijau"
      ? `background: ${props.grad}; -webkit-background-clip: text; -webkit-text-fill-color: transparent;`
      : `color: ${props.color};`}
`;

const PhotoFrame = styled(motion.div)`
  width: ${(props) => (props.tema === "hijau" ? "210px" : "320px")};
  height: ${(props) => (props.tema === "hijau" ? "230px" : "180px")};
  margin: 20px 0;
  border-radius: 12px;
  overflow: hidden;
  animation: ${floating} 5s ease-in-out infinite;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const GoldText = styled.p`
  color: #c4a74f;
  margin: 0;
  text-align: center;
  font-size: ${(props) => props.size || "16px"};
  font-weight: ${(props) => (props.bold ? "700" : "400")};
`;
const ActionButton = styled(motion.button)`
  width: 280px;
  height: 55px;
  border-radius: 50px;
  border: none;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  background: ${(props) => props.btnGrad};
  cursor: pointer;
  margin-top: 10px;
`;

export default function App() {
  const [data, setData] = useState(null);
  const [to, setTo] = useState("Tamu Undangan");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // FIX JAM: Cuma tampil (19:00)
  const formatJamClean = (str) => {
    if (!str) return "";
    if (str.toString().includes("T")) {
      const d = new Date(str);
      return `(${d.getHours().toString().padStart(2, "0")}:${d
        .getMinutes()
        .toString()
        .padStart(2, "0")})`;
    }
    return `(${str})`;
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const tamu = params.get("to");
    if (tamu) setTo(decodeURIComponent(tamu));
    if (id) {
      fetch(`${GAS_URL}?id=${id}`)
        .then((res) => res.json())
        .then((res) => {
          if (!res.error) setData(res);
        });
    }
  }, []);

  const handleRSVP = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new URLSearchParams(new FormData(e.target)).toString();
    try {
      await fetch(`${GAS_URL}?${formData}`, {
        method: "POST",
        mode: "no-cors",
      });
      alert("Konfirmasi Berhasil!");
      setShowForm(false);
    } catch (e) {
      alert("Gagal kirim.");
    } finally {
      setLoading(false);
    }
  };

  if (!data)
    return (
      <LoadingScreen>
        <div className="logo">Undangan</div>
        <div className="bar">
          <div className="progress" />
        </div>
      </LoadingScreen>
    );

  const style = DAFTAR_TEMA[data.tema] || DAFTAR_TEMA.putih;

  return (
    <>
      <GlobalStyle />
      <Container bg={style.bg} bgImg={`/asset/pattern-${data.tema}.png`}>
        <HeaderImg
          src={`/asset/header-${data.tema}.png`}
          initial={{ y: -50 }}
          animate={{ y: 0 }}
        />

        <Content initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <GoldText size="22px">Undangan</GoldText>
          <Title tema={data.tema} color={style.gold} grad={style.titleGrad}>
            Halal Bihalal
          </Title>
          <GoldText size="14px" style={{ letterSpacing: "2px" }}>
            {data.instansi}
          </GoldText>

          <PhotoFrame tema={data.tema}>
            <img
              src={data.fotourl || `/asset/foto-${data.tema}.png`}
              alt="Acara"
            />
          </PhotoFrame>

          <div style={{ marginBottom: "30px" }}>
            <GoldText bold size="18px">
              {data.tanggal}
            </GoldText>
            <GoldText bold size="18px">
              {formatJamClean(data.jam)}
            </GoldText>
            <GoldText size="14px">📍 {data.lokasi}</GoldText>
          </div>

          <GoldText size="14px">Kepada Yth:</GoldText>
          <GoldText bold size="26px" style={{ marginBottom: "30px" }}>
            {to}
          </GoldText>

          <a
            href={data.mapsurl}
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: "none", marginBottom: "10px" }}
          >
            <div
              style={{
                width: "280px",
                height: "55px",
                borderRadius: "50px",
                border: `2px solid ${style.gold}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: style.gold,
                fontWeight: "bold",
              }}
            >
              📍 Lokasi Maps
            </div>
          </a>
          <ActionButton
            btnGrad={style.btnGrad}
            onClick={() => setShowForm(true)}
          >
            Konfirmasi Kehadiran
          </ActionButton>
        </Content>

        <FooterImg
          src={`/asset/footer-${data.tema}.png`}
          initial={{ y: 50 }}
          animate={{ y: 0 }}
        />

        <AnimatePresence>
          {showForm && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.85)",
                zIndex: 999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() => setShowForm(false)}
            >
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.5 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: "#fff",
                  width: "90%",
                  maxWidth: "350px",
                  padding: "25px",
                  borderRadius: "20px",
                }}
              >
                <GoldText bold size="20px" style={{ marginBottom: "15px" }}>
                  Form Kehadiran
                </GoldText>
                <form onSubmit={handleRSVP}>
                  <input
                    type="hidden"
                    name="id"
                    value={new URLSearchParams(window.location.search).get(
                      "id"
                    )}
                  />
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
                  />
                  <select
                    name="status"
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
                  <ActionButton
                    as="button"
                    type="submit"
                    btnGrad={style.btnGrad}
                    disabled={loading}
                    style={{ width: "100%", height: "45px" }}
                  >
                    {loading ? "Mengirim..." : "Kirim Konfirmasi"}
                  </ActionButton>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </Container>
    </>
  );
}
