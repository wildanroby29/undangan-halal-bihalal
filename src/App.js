import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled, { createGlobalStyle, keyframes } from "styled-components";

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

// --- ANIMASI ---
const floating = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const musicWave = keyframes`
  0%, 100% { height: 4px; }
  50% { height: 16px; }
`;

const GlobalStyle = createGlobalStyle`
  html, body, #root { margin: 0; padding: 0; width: 100%; height: 100%; overflow-x: hidden; background: ${(
    props
  ) => props.tema.bg}; }
  * { font-style: normal !important; box-sizing: border-box; font-family: sans-serif; outline: none !important; } 
`;

// --- STYLED COMPONENTS ---
const Container = styled.div`
  width: 100%;
  max-width: 430px;
  min-height: 100vh;
  margin: 0 auto;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-image: url(${(props) => props.bgImg});
  background-size: cover;
  background-position: center;
`;

const HeaderImg = styled(motion.img)`
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  border: none;
`;
const FooterImg = styled(motion.img)`
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 1;
  border: none;
`;

const MusicWrapper = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const WaveBar = styled.div`
  width: 3px;
  background: ${(props) => props.color};
  border-radius: 2px;
  animation: ${musicWave} ${(props) => props.dur} ease-in-out infinite;
  animation-play-state: ${(props) => (props.playing ? "running" : "paused")};
`;

const MusicToggle = styled(motion.button)`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: ${(props) => props.tema.gold};
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  font-size: 20px;
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

const MainContent = styled(motion.div)`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 5;
  padding-top: 320px;
  padding-bottom: 120px;
`;

const PhotoFrame = styled(motion.div)`
  width: ${(props) => (props.tema === "hijau" ? "204px" : "320px")};
  height: ${(props) => (props.tema === "hijau" ? "226px" : "180px")};
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

const ActionButton = styled(motion.button)`
  width: 280px;
  height: 55px;
  z-index: 10;
  border-radius: 50px;
  border: none;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  background: ${(props) => props.tema.btnGrad};
  box-shadow: 0 5px 15px ${(props) => props.tema.shadow};
`;

const MapsButton = styled(motion.a)`
  width: 280px;
  height: 55px;
  border-radius: 50px;
  border: 2px solid ${(props) => props.tema.gold};
  color: ${(props) => props.tema.gold};
  background: white;
  text-decoration: none;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Modal = styled(motion.div)`
  width: 90%;
  max-width: 350px;
  background: white;
  border-radius: 20px;
  padding: 25px;
  border: 2px solid ${(props) => props.tema.gold};
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin: 8px 0;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
`;
const Select = styled.select`
  width: 100%;
  padding: 12px;
  margin: 8px 0;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
`;

// --- LOGIC UTAMA ---
export default function App() {
  const [to, setTo] = useState("Tamu Undangan");
  const [tema, setTema] = useState("putih");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const n = params.get("to");
    const t = params.get("theme");
    if (n) setTo(decodeURIComponent(n));
    if (t && DAFTAR_TEMA[t]) setTema(t);
  }, []);

  const toggleMusic = () => {
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const scriptURL =
      "https://script.google.com/macros/s/AKfycbym7YKzkxd4SUsE-ybIzj5SwLh7sUnIYnjBE4IB7nN_usc6zRHEaTnsfxbQ3pIjMVnm6Q/exec";
    try {
      await fetch(scriptURL, {
        method: "POST",
        body: formData,
        mode: "no-cors",
      });
      alert("Konfirmasi Berhasil Terkirim!");
      setShowForm(false);
    } catch (error) {
      alert("Gagal kirim data.");
    } finally {
      setLoading(false);
    }
  };

  const style = DAFTAR_TEMA[tema];

  return (
    <>
      <GlobalStyle tema={style} />
      <Container tema={style} bgImg={`/asset/pattern-${tema}.png`}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Lobster&display=swap');`}</style>
        <audio ref={audioRef} loop src="/asset/music.mp3" />

        {/* MUSIC TOGGLE */}
        <MusicWrapper>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: "2px",
              height: "16px",
            }}
          >
            <WaveBar color={style.gold} dur="0.6s" playing={isPlaying} />
            <WaveBar color={style.gold} dur="0.8s" playing={isPlaying} />
            <WaveBar color={style.gold} dur="0.5s" playing={isPlaying} />
          </div>
          <MusicToggle
            onClick={toggleMusic}
            whileTap={{ scale: 0.9 }}
            tema={style}
          >
            {isPlaying ? "⏸" : "🎵"}
          </MusicToggle>
        </MusicWrapper>

        {/* HEADER & TOP TITLES */}
        <HeaderImg
          src={`/asset/header-${tema}.png`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />

        <TopSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GoldText size="26px" tema={style}>
            Undangan
          </GoldText>
          <Title
            tema={style}
            temaActive={tema}
            titleGrad={style.titleGrad}
            color={style.gold}
          >
            Halal Bihalal
          </Title>
          <GoldText size="16px" tema={style}>
            Nama Instansi / Keluarga
          </GoldText>
        </TopSection>

        {/* MAIN CONTENT AREA */}
        <MainContent
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <PhotoFrame tema={tema}>
            <img src={`/asset/foto-${tema}.png`} alt="Acara" />
          </PhotoFrame>

          <GoldText weight="bold" tema={style}>
            Minggu, 12 April 2026
          </GoldText>
          <GoldText size="14px" tema={style}>
            10.00 WIB - Selesai
          </GoldText>
          <GoldText size="14px" tema={style} style={{ marginBottom: "30px" }}>
            Alamat Lengkap Lu Di Sini
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

          <MapsButton
            href="https://maps.app.goo.gl/7gyMqs8n5Ne3i9oaA"
            target="_blank"
            tema={style}
            whileTap={{ scale: 0.95 }}
          >
            📍 Buka Lokasi Maps
          </MapsButton>

          <ActionButton
            onClick={() => setShowForm(true)}
            tema={style}
            whileTap={{ scale: 0.95 }}
          >
            Konfirmasi Kehadiran
          </ActionButton>
        </MainContent>

        <FooterImg
          src={`/asset/footer-${tema}.png`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        />

        {/* --- POPUP RSVP (FIXED ERROR) --- */}
        <AnimatePresence>
          {showForm && (
            <Overlay
              key="overlay-rsvp"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowForm(false)}
            >
              <Modal
                key="modal-rsvp"
                tema={style}
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                onClick={(e) => e.stopPropagation()}
              >
                <GoldText
                  weight="bold"
                  size="20px"
                  style={{ marginBottom: "15px" }}
                  tema={style}
                >
                  Form Kehadiran
                </GoldText>

                <form onSubmit={handleFormSubmit}>
                  <Input
                    name="nama"
                    defaultValue={to}
                    required
                    placeholder="Nama Lengkap"
                  />
                  <Select name="kehadiran" required>
                    <option value="">-- Pilih Kehadiran --</option>
                    <option value="Hadir">Hadir</option>
                    <option value="Tidak Hadir">Berhalangan</option>
                  </Select>
                  <Input
                    name="jumlah"
                    type="number"
                    required
                    placeholder="Jumlah Orang"
                    min="1"
                  />

                  <ActionButton
                    as="button"
                    type="submit"
                    disabled={loading}
                    style={{ width: "100%", height: "45px", marginTop: "10px" }}
                    tema={style}
                  >
                    {loading ? "Mengirim..." : "Kirim Sekarang"}
                  </ActionButton>

                  <p
                    onClick={() => setShowForm(false)}
                    style={{
                      textAlign: "center",
                      cursor: "pointer",
                      color: "#999",
                      marginTop: "15px",
                      fontSize: "14px",
                    }}
                  >
                    Batal
                  </p>
                </form>
              </Modal>
            </Overlay>
          )}
        </AnimatePresence>
      </Container>
    </>
  );
}
