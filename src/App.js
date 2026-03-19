import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled, { createGlobalStyle, keyframes } from "styled-components";

const GAS_URL =
  "https://script.google.com/macros/s/AKfycbwFIk7uPGb93SzhTWyljVPa1aQoY4kA3y8xughXhSAv_mCKEZm4V0IYrr7I6_1yFxGgLw/exec";

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
const pulse = keyframes` 0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(196, 167, 79, 0.7); } 70% { transform: scale(1.1); box-shadow: 0 0 0 12px rgba(196, 167, 79, 0); } 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(196, 167, 79, 0); } `;

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

const MusicButton = styled(motion.div)`
  position: fixed;
  bottom: 25px;
  right: 25px;
  width: 55px;
  height: 55px;
  background: ${(props) => props.btnGrad};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 999;
  animation: ${(props) => (props.playing ? pulse : "none")} 2s infinite;
  svg {
    width: 26px;
    height: 26px;
    fill: white;
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
  font-size: 50px;
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
  box-shadow: none !important;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border: none !important;
  }
`;

const GoldText = styled(motion.p)`
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const audioRef = useRef(null);

  const getDriveUrl = (url) => {
    if (!url) return null;
    if (url.includes("drive.google.com")) {
      const fileId =
        url.split("/d/")[1]?.split("/")[0] ||
        url.split("id=")[1]?.split("&")[0];
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
    return url;
  };

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

  const toggleMusic = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleRSVP = async (e) => {
    e.preventDefault();
    setLoadingForm(true);
    const formData = new URLSearchParams(new FormData(e.target)).toString();
    try {
      await fetch(`${GAS_URL}?${formData}`, {
        method: "POST",
        mode: "no-cors",
      });
      alert("Terima kasih! Konfirmasi Anda telah tersimpan.");
      setShowForm(false);
    } catch (e) {
      alert("Maaf, terjadi kesalahan.");
    } finally {
      setLoadingForm(false);
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
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <>
      <GlobalStyle />
      <audio ref={audioRef} loop src="/asset/music.mp3"></audio>

      <MusicButton
        btnGrad={style.btnGrad}
        playing={isPlaying}
        onClick={toggleMusic}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
      >
        {isPlaying ? (
          <svg viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
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
              src={getDriveUrl(data.fotourl) || `/asset/foto-${data.tema}.png`}
              alt="Foto Acara"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `/asset/foto-${data.tema}.png`;
              }}
            />
          </PhotoFrame>

          <div style={{ margin: "15px 0" }}>
            <GoldText variants={itemVariants} bold size="20px">
              {formatTglIndo(data.tanggal)}
            </GoldText>
            <GoldText variants={itemVariants} bold size="26px">
              ({cleanJam(data.jam)} WIB)
            </GoldText>
            <GoldText
              variants={itemVariants}
              bold
              size="22px"
              style={{ marginTop: "5px" }}
            >
              📍 {data.lokasi}
            </GoldText>
          </div>

          <motion.div variants={itemVariants} style={{ margin: "30px 0" }}>
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
              gap: "15px",
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
                  height: "55px",
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
                height: "55px",
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
                  boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
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
                    disabled={loadingForm}
                    style={{
                      width: "100%",
                      height: "55px",
                      borderRadius: "50px",
                      border: "none",
                      background: style.btnGrad,
                      color: "#fff",
                      fontSize: "16px",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    {loadingForm ? "Mengirim..." : "Kirim Sekarang"}
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
