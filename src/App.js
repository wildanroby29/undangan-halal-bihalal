import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled, { createGlobalStyle, keyframes } from "styled-components";

// PASTIKAN LINK GAS SUDAH BENAR
const GAS_URL =
  "https://script.google.com/macros/s/AKfycbys0cwBvpGmhenlu4fpFcZ94jvVqWU-RYNcHtX1xMePxD_gZXdSgN7iA862c_waIliVng/exec";

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

const shimmer = keyframes` 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } `;

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Lobster&family=Poppins:wght@400;700&display=swap');
  html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow-x: hidden; background: #fff; }
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
    font-size: 32px;
    margin-bottom: 20px;
  }
  .bar {
    width: 150px;
    height: 4px;
    background: #eee;
    border-radius: 10px;
    position: relative;
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
  background-color: ${(props) => props.bg};
  background-image: url(${(props) => props.bgImg});
  background-size: cover;
  background-position: center;
`;

const Content = styled(motion.div)`
  padding: 130px 20px 100px;
  z-index: 5;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-family: "Lobster", cursive;
  font-size: 48px;
  margin: 0;
  font-weight: 400;
  ${(props) =>
    props.tema === "hijau"
      ? `background: ${props.grad}; -webkit-background-clip: text; -webkit-text-fill-color: transparent;`
      : `color: ${props.color};`}
`;

const PhotoFrame = styled.div`
  width: ${(props) => (props.tema === "hijau" ? "210px" : "320px")};
  height: ${(props) => (props.tema === "hijau" ? "230px" : "180px")};
  margin: 15px 0;
  border-radius: 12px;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const GoldText = styled.p`
  color: #c4a74f;
  margin: 2px 0;
  text-align: center;
  font-size: ${(props) => props.size || "16px"};
  font-weight: ${(props) => (props.bold ? "700" : "400")};
`;

export default function App() {
  const [data, setData] = useState(null);
  const [to, setTo] = useState("Tamu Undangan");
  const [showForm, setShowForm] = useState(false);

  const formatTglIndo = (str) => {
    if (!str) return "";
    const d = new Date(str);
    return isNaN(d.getTime())
      ? str
      : d.toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        });
  };

  const cleanJam = (jamStr) => {
    if (!jamStr) return "";
    if (jamStr.toString().includes("T")) {
      const d = new Date(jamStr);
      return `${d.getHours().toString().padStart(2, "0")}:${d
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
    }
    return jamStr;
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const t = params.get("to");
    if (t) setTo(decodeURIComponent(t));
    if (id) {
      fetch(`${GAS_URL}?id=${id}`)
        .then((res) => res.json())
        .then((res) => {
          if (!res.error) setData(res);
        });
    }
  }, []);

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
        <img
          src={`/asset/header-${data.tema}.png`}
          style={{ width: "100%", position: "absolute", top: 0, left: 0 }}
        />

        <Content
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <GoldText size="20px">Undangan</GoldText>
          <Title tema={data.tema} color={style.gold} grad={style.titleGrad}>
            Halal Bihalal
          </Title>
          <GoldText
            size="14px"
            style={{ letterSpacing: "2px", textTransform: "uppercase" }}
          >
            {data.instansi}
          </GoldText>

          <PhotoFrame tema={data.tema}>
            <img
              src={data.fotourl || `/asset/foto-${data.tema}.png`}
              alt="Acara"
            />
          </PhotoFrame>

          <div style={{ margin: "10px 0" }}>
            <GoldText bold size="19px">
              {formatTglIndo(data.tanggal)}
            </GoldText>
            <GoldText bold size="24px">
              ({cleanJam(data.jam)} WIB)
            </GoldText>
            {/* LOKASI GEDE DAN BOLD */}
            <GoldText bold size="22px" style={{ marginTop: "5px" }}>
              📍 {data.lokasi}
            </GoldText>
          </div>

          <div style={{ margin: "25px 0" }}>
            <GoldText size="14px">Kepada Yth:</GoldText>
            <GoldText bold size="28px">
              {to}
            </GoldText>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <a
              href={data.mapsurl}
              target="_blank"
              rel="noreferrer"
              style={{ textDecoration: "none" }}
            >
              <div
                style={{
                  width: "280px",
                  height: "52px",
                  borderRadius: "50px",
                  border: `2px solid ${style.gold}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: style.gold,
                  fontWeight: "bold",
                  background: "white",
                }}
              >
                📍 Buka Lokasi Maps
              </div>
            </a>
            <button
              onClick={() => setShowForm(true)}
              style={{
                width: "280px",
                height: "52px",
                borderRadius: "50px",
                border: "none",
                background: style.btnGrad,
                color: "#fff",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Konfirmasi Kehadiran
            </button>
          </div>
        </Content>

        <img
          src={`/asset/footer-${data.tema}.png`}
          style={{ width: "100%", position: "absolute", bottom: 0, left: 0 }}
        />
      </Container>
    </>
  );
}
