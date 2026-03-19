import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled, { createGlobalStyle, keyframes } from "styled-components";

const GAS_URL =
  "https://script.google.com/macros/s/AKfycbxIDZNjPrm26i4Z_-ephPl82oTyhOtrzZ6m8BiKVn-mGeqx0aJVqD-VPESvlCfc6FPH3Q/exec";

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
  body { margin: 0; font-family: 'Poppins', sans-serif; background: #fff; overflow-x: hidden; }
  * { font-style: normal !important; box-sizing: border-box; }
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
  margin: 0 auto;
  min-height: 100vh;
  position: relative;
  text-align: center;
  background: ${(props) => props.bg};
`;
const Title = styled(motion.h1)`
  font-family: "Lobster", cursive;
  font-size: 52px;
  margin: 10px 0;
  font-weight: 400;
  ${(props) =>
    props.tema === "hijau"
      ? `background: ${props.grad}; -webkit-background-clip: text; -webkit-text-fill-color: transparent;`
      : `color: ${props.color};`}
`;
const GoldText = styled(motion.p)`
  color: #c4a74f;
  font-size: ${(props) => props.size || "16px"};
  font-weight: ${(props) => (props.bold ? "700" : "400")};
  margin: 5px 0;
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
`;

export default function App() {
  const [data, setData] = useState(null);
  const [to, setTo] = useState("Tamu Undangan");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const formatTglIndo = (str) => {
    if (!str) return "";
    const d = new Date(str);
    if (isNaN(d.getTime())) return str;
    return d.toLocaleDateString("id-ID", {
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

  // Animasi Stagger
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <>
      <GlobalStyle />
      <Container bg={style.bg}>
        <motion.img
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 1 }}
          src={`/asset/header-${data.tema}.png`}
          style={{ width: "100%" }}
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          style={{ padding: "20px" }}
        >
          <GoldText variants={itemVariants} size="22px">
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
            style={{ textTransform: "uppercase", letterSpacing: "2px" }}
          >
            {data.instansi}
          </GoldText>

          <motion.div
            variants={itemVariants}
            style={{
              width: "85%",
              margin: "25px auto",
              borderRadius: "15px",
              overflow: "hidden",
              boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
            }}
          >
            <img
              src={data.fotourl || `/asset/foto-${data.tema}.png`}
              alt="Acara"
              style={{ width: "100%" }}
            />
          </motion.div>

          <div style={{ marginBottom: "30px" }}>
            <GoldText variants={itemVariants} bold size="20px">
              {formatTglIndo(data.tanggal)}
            </GoldText>
            <GoldText variants={itemVariants} bold size="26px">
              ({cleanJam(data.jam)} WIB)
            </GoldText>
            {/* FONT LOKASI GEDE & JELAS */}
            <GoldText
              variants={itemVariants}
              size="22px"
              bold
              style={{ marginTop: "10px" }}
            >
              📍 {data.lokasi}
            </GoldText>
          </div>

          <motion.div variants={itemVariants} style={{ margin: "40px 0" }}>
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
              alignItems: "center",
              gap: "15px",
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
            <ActionButton
              btnGrad={style.btnGrad}
              onClick={() => setShowForm(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Konfirmasi Kehadiran
            </ActionButton>
          </motion.div>
        </motion.div>

        <motion.img
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ duration: 1 }}
          src={`/asset/footer-${data.tema}.png`}
          style={{ width: "100%", marginTop: "40px" }}
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
                zIndex: 999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() => setShowForm(false)}
            >
              <motion.div
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                exit={{ y: 50 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: "#fff",
                  width: "90%",
                  maxWidth: "350px",
                  padding: "30px",
                  borderRadius: "25px",
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
                    }}
                  />
                  <ActionButton
                    as="button"
                    type="submit"
                    btnGrad={style.btnGrad}
                    disabled={loading}
                    style={{ width: "100%" }}
                  >
                    {loading ? "Mengirim..." : "Kirim Sekarang"}
                  </ActionButton>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </>
  );
}
