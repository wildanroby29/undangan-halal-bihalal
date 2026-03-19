import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled, { createGlobalStyle, keyframes } from "styled-components";

// --- CONFIG & DATA ---
// PASTIIN INI PAKE LINK DEPLOYMENT TERBARU DARI APPS SCRIPT
const GAS_URL =
  "https://script.google.com/macros/s/AKfycbxOovoxyCv_GSAOtFCm0FdbgTr3qHW1JWjjYvMju5QhKnk-rPwYlApnI7_tWvrGaJP9Qg/exec";

const DAFTAR_TEMA = {
  putih: {
    bg: "#ffffff",
    gold: "#c4a74f",
    btnGrad: "linear-gradient(90deg, #C4A74F 0%, #967102 49%, #C4A74F 99%)",
    coverBg: "#fdfbf7",
  },
  hijau: {
    bg: "#042f2e",
    gold: "#c4a74f",
    btnGrad: "linear-gradient(90deg, #C4A74F 0%, #967102 49%, #C4A74F 99%)",
    titleGrad: "linear-gradient(180deg, #fef08a 0%, #c4a74f 50%, #967102 100%)",
    coverBg: "#032524",
  },
};

// --- ANIMATIONS ---
const floating = keyframes` 0% { transform: translateY(0px); } 50% { transform: translateY(-12px); } 100% { transform: translateY(0px); } `;
const shimmer = keyframes` 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } `;
const pulse = keyframes` 0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(196, 167, 79, 0.7); } 70% { transform: scale(1.1); box-shadow: 0 0 0 12px rgba(196, 167, 79, 0); } 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(196, 167, 79, 0); } `;

// --- STYLED COMPONENTS ---
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Lobster&family=Poppins:wght@400;700&display=swap');
  html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow-x: hidden; background: #fff; }
  * { font-style: normal !important; box-sizing: border-box; font-family: 'Poppins', sans-serif; }
`;

const WelcomeCover = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 9999;
  background-color: ${(props) => props.bg};
  background-image: url(${(props) => props.bgImg});
  background-size: cover;
  background-position: center;
  width: 100%;
  max-width: 430px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
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
  text-align: center;
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
  width: 220px;
  height: 220px;
  margin: 25px 0;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #c4a74f;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  animation: ${floating} 4s ease-in-out infinite;
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

// --- MAIN APP ---
export default function App() {
  const [data, setData] = useState(null);
  const [to, setTo] = useState("Tamu Undangan");
  const [urlTema, setUrlTema] = useState("putih");
  const [isOpen, setIsOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const [photoLoaded, setPhotoLoaded] = useState(false); // State buat nunggu foto
  const audioRef = useRef(null);

  const getDriveUrl = (url) => {
    if (!url || url.trim() === "") return null;
    if (
      url.includes("ibb.co") ||
      url.includes("postimg") ||
      url.includes("telegra.ph")
    )
      return url;
    if (url.includes("drive.google.com")) {
      const fileId =
        url.split("/d/")[1]?.split("/")[0] ||
        url.split("id=")[1]?.split("&")[0];
      return `https://lh3.googleusercontent.com/u/0/d/${fileId}=s1000`;
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
    const temaUrl = params.get("t");
    if (t) setTo(decodeURIComponent(t));
    if (temaUrl && DAFTAR_TEMA[temaUrl]) setUrlTema(temaUrl);
    if (id) {
      fetch(`${GAS_URL}?id=${id}`)
        .then((res) => res.json())
        .then((res) => {
          if (!res.error) setData(res);
        })
        .catch((err) => console.error(err));
    }
  }, []);

  const handleOpenInvitation = () => {
    setIsOpen(true);
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  const styleUrl = DAFTAR_TEMA[urlTema] || DAFTAR_TEMA.putih;
  const style = data ? DAFTAR_TEMA[data.tema] || DAFTAR_TEMA.putih : styleUrl;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.5 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <>
      <GlobalStyle />
      <audio ref={audioRef} loop src="/asset/music.mp3"></audio>

      <AnimatePresence>
        {!isOpen && (
          <WelcomeCover
            bg={styleUrl.bg}
            bgImg={`/asset/pattern-${urlTema}.png`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.img
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
              src={`/asset/header-${urlTema}.png`}
              style={{ width: "100%", position: "absolute", top: 0, left: 0 }}
            />

            <Content
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              <GoldText variants={itemVariants} size="20px">
                Undangan
              </GoldText>
              <Title
                variants={itemVariants}
                tema={urlTema}
                color={styleUrl.gold}
                grad={styleUrl.titleGrad}
              >
                Halal Bihalal
              </Title>
              <GoldText
                variants={itemVariants}
                size="14px"
                style={{ letterSpacing: "2px", textTransform: "uppercase" }}
              >
                {data ? data.instansi : "AKSARA STORE"}
              </GoldText>

              {data && getDriveUrl(data.fotourl) && (
                <PhotoFrame variants={itemVariants}>
                  <img
                    src={getDriveUrl(data.fotourl)}
                    alt="Instansi"
                    onLoad={() => setPhotoLoaded(true)}
                  />
                </PhotoFrame>
              )}

              {/* Sisa konten ini (tamu & tombol) CUMA muncul kalau foto sudah keload sempurna */}
              <AnimatePresence>
                {(!data || !getDriveUrl(data.fotourl) || photoLoaded) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <div style={{ marginTop: "10px" }}>
                      <GoldText size="14px">Kepada Yth:</GoldText>
                      <GoldText bold size="28px">
                        {to}
                      </GoldText>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleOpenInvitation}
                      style={{
                        width: "280px",
                        height: "55px",
                        borderRadius: "50px",
                        border: "none",
                        background: styleUrl.btnGrad,
                        color: "#fff",
                        fontSize: "16px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        marginTop: "30px",
                        boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                      }}
                    >
                      Buka Undangan
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </Content>

            <motion.img
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
              src={`/asset/footer-${urlTema}.png`}
              style={{
                width: "100%",
                position: "absolute",
                bottom: 0,
                left: 0,
              }}
            />
          </WelcomeCover>
        )}
      </AnimatePresence>

      {isOpen && data && (
        <>
          <MusicButton
            btnGrad={style.btnGrad}
            playing={isPlaying}
            onClick={() => {
              if (isPlaying) audioRef.current.pause();
              else audioRef.current.play();
              setIsPlaying(!isPlaying);
            }}
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
              src={`/asset/header-${data.tema}.png`}
              style={{ width: "100%", position: "absolute", top: 0, left: 0 }}
            />
            <Content
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
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

              {getDriveUrl(data.fotourl) && (
                <PhotoFrame variants={itemVariants}>
                  <img src={getDriveUrl(data.fotourl)} alt="Acara" />
                </PhotoFrame>
              )}

              <motion.div variants={itemVariants} style={{ margin: "15px 0" }}>
                <GoldText bold size="22px">
                  {formatTglIndo(data.tanggal)}
                </GoldText>
                <GoldText bold size="26px">
                  ({cleanJam(data.jam)} WIB)
                </GoldText>
                <GoldText bold size="22px">
                  📍 {data.lokasi}
                </GoldText>
              </motion.div>

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
                  gap: "15px",
                }}
              >
                <a
                  href={data.mapsurl}
                  target="_blank"
                  rel="noreferrer"
                  style={{ textDecoration: "none" }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
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
                  </motion.div>
                </a>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
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
                </motion.button>
              </motion.div>
            </Content>
            <motion.img
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              src={`/asset/footer-${data.tema}.png`}
              style={{
                width: "100%",
                position: "absolute",
                bottom: 0,
                left: 0,
              }}
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
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      background: "#fff",
                      width: "90%",
                      maxWidth: "350px",
                      padding: "30px",
                      borderRadius: "25px",
                      margin: "auto",
                    }}
                  >
                    <GoldText
                      bold
                      size="22px"
                      style={{ color: "#333", marginBottom: "20px" }}
                    >
                      Form Kehadiran
                    </GoldText>
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        setLoadingForm(true);
                        const formData = new URLSearchParams(
                          new FormData(e.target)
                        ).toString();
                        try {
                          await fetch(`${GAS_URL}?${formData}`, {
                            method: "POST",
                            mode: "no-cors",
                          });
                          alert(
                            "Terima kasih! Konfirmasi Anda telah tersimpan."
                          );
                          setShowForm(false);
                        } catch {
                          alert("Maaf, terjadi kesalahan.");
                        } finally {
                          setLoadingForm(false);
                        }
                      }}
                    >
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
                          marginBottom: "10px",
                          borderRadius: "8px",
                          border: "1px solid #ddd",
                        }}
                      />
                      <select
                        name="status"
                        style={{
                          width: "100%",
                          padding: "12px",
                          marginBottom: "10px",
                          borderRadius: "8px",
                          border: "1px solid #ddd",
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
                          marginBottom: "20px",
                          borderRadius: "8px",
                          border: "1px solid #ddd",
                        }}
                      />
                      <button
                        type="submit"
                        disabled={loadingForm}
                        style={{
                          width: "100%",
                          height: "50px",
                          borderRadius: "25px",
                          border: "none",
                          background: style.btnGrad,
                          color: "#fff",
                          fontWeight: "bold",
                        }}
                      >
                        {loadingForm ? "Mengirim..." : "Kirim Konfirmasi"}
                      </button>
                    </form>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </Container>
        </>
      )}
    </>
  );
}
