import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled, { createGlobalStyle, keyframes } from "styled-components";

// PASTIKAN LINK GAS SUDAH BENAR
const GAS_URL =
  "https://script.google.com/macros/s/AKfycbwSpM7kX43OObUMz0Cy-I8pdcEiAYo3A6Fhgg10AAukX6anuQrkjSRo9rOutljKeu-ciw/exec";

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

const Title = styled(motion.h1)`
  font-family: "Lobster", cursive;
  font-size: 48px;
  margin: 0;
  font-weight: 400;
  ${(props) =>
    props.tema === "hijau"
      ? `background: ${props.grad}; -webkit-background-clip: text; -webkit-text-fill-color: transparent;`
      : `color: ${props.color};`}
`;

const PhotoFrame = styled(motion.div)`
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

const GoldText = styled(motion.p)`
  color: #c4a74f;
  margin: 2px 0;
  text-align: center;
  font-size: ${(props) => props.size || "16px"};
  font-weight: ${(props) => (props.bold ? "700" : "400")};
`;

// CSS Buat Tombol Musik
const MusicButton = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  background: ${(props) => props.btnGrad};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 999;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

export default function App() {
  const [data, setData] = useState(null);
  const [to, setTo] = useState("Tamu Undangan");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

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

  const handleRSVP = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new URLSearchParams(new FormData(e.target)).toString();
    try {
      await fetch(`${GAS_URL}?${formData}`, {
        method: "POST",
        mode: "no-cors",
      });
      alert("Terima kasih! Konfirmasi Anda telah tersimpan.");
      setShowForm(false);
    } catch (e) {
      alert("Gagal mengirim.");
    } finally {
      setLoading(false);
    }
  };

  const toggleMusic = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
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

  // Variasi Animasi (Staggered Children)
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // Jeda antar elemen muncul
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <>
      <GlobalStyle />
      {/* PAKE LAGU ADEM ISLAMI */}
      <audio
        ref={audioRef}
        loop
        src="https://assets.mixkit.co/music/preview/mixkit-beautiful-instrumental-music-for-meditation-and-yoga-481.mp3"
      ></audio>

      <MusicButton btnGrad={style.btnGrad} onClick={toggleMusic}>
        <span style={{ fontSize: "24px", color: "#fff" }}>
          {isPlaying ? "🔇" : "🔊"}
        </span>
      </MusicButton>

      <Container bg={style.bg} bgImg={`/asset/pattern-${data.tema}.png`}>
        <motion.img
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 1 }}
          src={`/asset/header-${data.tema}.png`}
          style={{ width: "100%", position: "absolute", top: 0, left: 0 }}
        />

        <Content variants={containerVariants} initial="hidden" animate="show">
          <GoldText variants={itemVariants} size="20px">
            Undangan
          </GoldText>
          <Title
            variants={itemVariants}
            tema={data.tema}
            color={style.gold}
            grad={style.titleGrad}
          >
            Halal Bihalal
          </Title>
          <GoldText
            variants={itemVariants}
            size="14px"
            style={{ letterSpacing: "2px", textTransform: "uppercase" }}
          >
            {data.instansi}
          </GoldText>

          <PhotoFrame variants={itemVariants} tema={data.tema}>
            <img
              src={data.fotourl || `/asset/foto-${data.tema}.png`}
              alt="Acara"
            />
          </PhotoFrame>

          <div style={{ margin: "10px 0" }}>
            <GoldText variants={itemVariants} bold size="19px">
              {formatTglIndo(data.tanggal)}
            </GoldText>
            <GoldText variants={itemVariants} bold size="24px">
              ({cleanJam(data.jam)} WIB)
            </GoldText>
            {/* LOKASI GEDE DAN BOLD */}
            <GoldText
              variants={itemVariants}
              bold
              size="22px"
              style={{ marginTop: "5px" }}
            >
              📍 {data.lokasi}
            </GoldText>
          </div>

          <motion.div variants={itemVariants} style={{ margin: "25px 0" }}>
            <GoldText size="14px">Kepada Yth:</GoldText>
            <GoldText bold size="28px">
              {to}
            </GoldText>
          </motion.div>

          <motion.div
            variants={itemVariants}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              alignItems: "center",
            }}
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
          </motion.div>
        </Content>

        <motion.img
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ duration: 1 }}
          src={`/asset/footer-${data.tema}.png`}
          style={{ width: "100%", position: "absolute", bottom: 0, left: 0 }}
        />

        {/* POPUP FORM BALIK LAGI */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.85)",
                zIndex: 1000,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() => setShowForm(false)}
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: "#fff",
                  width: "90%",
                  maxWidth: "350px",
                  padding: "30px",
                  borderRadius: "25px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
                }}
              >
                <GoldText
                  bold
                  size="22px"
                  style={{ color: "#333", marginBottom: "20px" }}
                >
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
                      padding: "15px",
                      marginBottom: "15px",
                      border: "1px solid #eee",
                      borderRadius: "12px",
                      background: "#f9f9f9",
                      fontSize: "16px",
                    }}
                  />
                  <select
                    name="status"
                    required
                    style={{
                      width: "100%",
                      padding: "15px",
                      marginBottom: "15px",
                      border: "1px solid #eee",
                      borderRadius: "12px",
                      background: "#f9f9f9",
                      fontSize: "16px",
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
                      padding: "15px",
                      marginBottom: "20px",
                      border: "1px solid #eee",
                      borderRadius: "12px",
                      background: "#f9f9f9",
                      fontSize: "16px",
                    }}
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: "100%",
                      height: "50px",
                      borderRadius: "50px",
                      border: "none",
                      background: style.btnGrad,
                      color: "#fff",
                      fontSize: "16px",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    {loading ? "Mengirim..." : "Kirim Sekarang"}
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </>
  );
}
