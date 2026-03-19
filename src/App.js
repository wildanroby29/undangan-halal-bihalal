import React, { useState, useEffect, useRef } from "react";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

const GAS_URL =
  "https://script.google.com/macros/s/AKfycbzStL7c-wExxTlDljzEwy3yiGpXRWhMZGjk5nCRNGmJCBQOkTQWWRtAvCtTW2vfr-Lr5Q/exec";

const GlobalStyle = createGlobalStyle`
  html, body, #root { margin: 0; padding: 0; width: 100%; height: 100%; overflow-x: hidden; background: ${(
    props
  ) => props.bg}; }
  * { font-style: normal !important; box-sizing: border-box; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; outline: none !important; }
  @import url('https://fonts.googleapis.com/css2?family=Lobster&display=swap');
`;

const floating = keyframes` 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } `;

const Container = styled.div`
  width: 100%;
  max-width: 430px;
  min-height: 100vh;
  margin: 0 auto;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${(props) => props.bg};
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
const Content = styled.div`
  padding: 340px 20px 140px 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 5;
  text-align: center;
`;
const PhotoFrame = styled(motion.div)`
  width: 300px;
  height: 170px;
  margin: 20px 0;
  border-radius: 15px;
  overflow: hidden;
  border: 3px solid #c4a74f;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [showRSVP, setShowRSVP] = useState(false);
  const audioRef = useRef(null);

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

  const formatTgl = (str) => {
    if (!str || !str.includes("T")) return str;
    return new Date(str).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading)
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#042f2e",
          color: "#fff",
        }}
      >
        Menyiapkan Undangan...
      </div>
    );
  if (!data)
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#000",
          color: "#fff",
        }}
      >
        ID Tidak Ditemukan
      </div>
    );

  const style =
    data.tema === "hijau"
      ? { bg: "#042f2e", gold: "#c4a74f", text: "#ffffff" }
      : { bg: "#ffffff", gold: "#c4a74f", text: "#c4a74f" };

  return (
    <>
      <GlobalStyle bg={style.bg} />
      <Container bg={style.bg}>
        <audio ref={audioRef} src="/asset/music.mp3" loop />

        {/* MUSIC BUTTON */}
        <div
          onClick={toggleMusic}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 100,
            background: "#c4a74f",
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
          }}
        >
          {isPlaying ? "⏸️" : "🎵"}
        </div>

        <HeaderImg
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          src={`/asset/header-${data.tema}.png`}
        />

        <Content>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ color: style.gold, fontSize: "22px", margin: 0 }}
          >
            Undangan
          </motion.p>
          <motion.h1
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            style={{
              fontFamily: "Lobster, cursive",
              color: style.gold,
              fontSize: "48px",
              margin: "5px 0",
              fontWeight: "400",
            }}
          >
            Halal Bihalal
          </motion.h1>
          <p style={{ color: style.text, fontSize: "18px" }}>{data.instansi}</p>

          <PhotoFrame
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <img
              src={data.fotourl || `/asset/foto-${data.tema}.png`}
              alt="Acara"
            />
          </PhotoFrame>

          <div style={{ color: style.text }}>
            <p
              style={{ fontWeight: "bold", fontSize: "22px", margin: "5px 0" }}
            >
              {formatTgl(data.tanggal)}
            </p>
            <p style={{ fontSize: "16px" }}>{data.jam} WIB</p>
            <p style={{ fontSize: "16px", margin: "10px 0 20px 0" }}>
              📍 {data.lokasi}
            </p>
          </div>

          <p style={{ color: style.gold, fontSize: "14px" }}>Kepada Yth:</p>
          <h2
            style={{
              color: style.text,
              fontSize: "26px",
              margin: "5px 0 30px 0",
            }}
          >
            {to}
          </h2>

          <a
            href={data.mapsurl}
            target="_blank"
            rel="noreferrer"
            style={{
              width: "280px",
              padding: "15px",
              borderRadius: "50px",
              border: `2px solid ${style.gold}`,
              color: style.gold,
              background: "white",
              textDecoration: "none",
              fontWeight: "bold",
              marginBottom: "15px",
              display: "block",
            }}
          >
            📍 Lihat Lokasi Acara
          </a>

          <button
            onClick={() => setShowRSVP(true)}
            style={{
              width: "280px",
              padding: "15px",
              borderRadius: "50px",
              border: "none",
              color: "#fff",
              fontSize: "16px",
              fontWeight: "bold",
              background: "linear-gradient(90deg, #C4A74F 0%, #967102 100%)",
              cursor: "pointer",
            }}
          >
            Konfirmasi Kehadiran
          </button>
        </Content>

        <FooterImg
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          src={`/asset/footer-${data.tema}.png`}
        />

        {/* MODAL RSVP */}
        <AnimatePresence>
          {showRSVP && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.8)",
                zIndex: 200,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                style={{
                  background: "#fff",
                  width: "90%",
                  maxWidth: "350px",
                  padding: "25px",
                  borderRadius: "20px",
                  textAlign: "center",
                }}
              >
                <h3 style={{ color: "#c4a74f", margin: "0 0 15px 0" }}>
                  Konfirmasi Kehadiran
                </h3>
                <form
                  action={GAS_URL}
                  method="POST"
                  target="_blank"
                  onSubmit={() => setShowRSVP(false)}
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
                      padding: "10px",
                      margin: "5px 0",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                    }}
                  />
                  <select
                    name="status"
                    style={{
                      width: "100%",
                      padding: "10px",
                      margin: "5px 0",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                    }}
                  >
                    <option value="Hadir">Saya Akan Hadir</option>
                    <option value="Berhalangan">Maaf, Berhalangan</option>
                  </select>
                  <input
                    name="jumlah"
                    type="number"
                    placeholder="Jumlah Orang"
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      margin: "5px 0",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      width: "100%",
                      padding: "12px",
                      marginTop: "15px",
                      borderRadius: "50px",
                      border: "none",
                      background: "#c4a74f",
                      color: "#fff",
                      fontWeight: "bold",
                    }}
                  >
                    Kirim Konfirmasi
                  </button>
                  <p
                    onClick={() => setShowRSVP(false)}
                    style={{
                      marginTop: "15px",
                      fontSize: "12px",
                      cursor: "pointer",
                      color: "#888",
                    }}
                  >
                    Batal
                  </p>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </>
  );
}
