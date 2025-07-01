import React, { useState } from "react";
import { Button, Backdrop, CircularProgress, Paper, TextField, Typography,  } from "@mui/material";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import RegisterModal from "./register";
import ProfileModal from "./profile";


const LoginModal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [registerOpen, setRegisterOpen] = useState(false);
  const [nickname, setNickname] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setError("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // 获取 Firestore 里的 nickname
      const uid = userCredential.user.uid;
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        setNickname(userDoc.data().nickname);
      } else {
        setNickname(null);
      }
      setOpen(false);
    } catch (err: any) {
      setError("Login failed. Please check your credentials.");
    }
    setLoading(false);
  };


  const handleLogout = async () => {
    await signOut(auth);
    setNickname(null);
    setEmail("");
    setPassword("");
  };


  return (
    <>
      {nickname ? (
        <>
          <Button
            onClick={() => setProfileOpen(true)}
            sx={{ color: "#222", backgroundColor: "#eee", '&:hover': { backgroundColor: "#ccc" }, height: '5vh' }}
            >
            {nickname}
            </Button>
            <ProfileModal
            open={profileOpen}
            nickname={nickname}
            onLogout={async () => {
                await handleLogout();
                setProfileOpen(false);
            }}
            onClose={() => setProfileOpen(false)}
            />
        </>
      ) : (
        <Button
          onClick={handleOpen}
          sx={{ color: "#222", backgroundColor: "#eee", '&:hover': { backgroundColor: "#ccc" }, height: '5vh' }}
        >
          Login
        </Button>
      )}
      <Backdrop
        sx={{ color: "#222", backgroundColor: "rgba(0,0,0,0.7)", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleClose}
      >
        <Paper
          sx={{
            padding: 4,
            minWidth: 300,
            backgroundColor: "#fff",
            color: "#222",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            alignItems: "center",
            boxShadow: "0 2px 16px rgba(0,0,0,0.15)"
          }}
          onClick={e => e.stopPropagation()}
        >
          <Typography variant="h5" sx={{ color: "#111" }}>Login</Typography>
          <form onSubmit={handleLogin} style={{ width: "100%" }}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              InputProps={{ style: { backgroundColor: "#f5f5f5", color: "#222" } }}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              InputProps={{ style: { backgroundColor: "#f5f5f5", color: "#222" } }}
            />
            {error && <Typography color="error">{error}</Typography>}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ mt: 2, backgroundColor: "#222", color: "#fff", '&:hover': { backgroundColor: "#444" } }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
            </Button>
          </form>
          <Typography sx={{ mt: 2, color: "#222" }}>No account?</Typography>
          <Button
            variant="outlined"
            fullWidth
            sx={{ color: "#222", borderColor: "#222", '&:hover': { backgroundColor: "#eee", borderColor: "#444" }, mt: 1 }}
            onClick={() => { setOpen(false); setRegisterOpen(true); }}
          >
            Register
          </Button>
        </Paper>
      </Backdrop>
      <RegisterModal open={registerOpen} onClose={() => setRegisterOpen(false)} />
    </>
  );
};

export default LoginModal;