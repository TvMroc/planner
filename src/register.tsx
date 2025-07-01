import React, { useState } from "react";
import { Button, Backdrop, CircularProgress, Paper, TextField, Typography } from "@mui/material";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "./firebase";

interface RegisterModalProps {
  open: boolean;
  onClose: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ open, onClose }) => {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      await setDoc(doc(db, "users", uid), {
        nickname,
        email,
        uid
      });
      onClose();
    } catch (err: any) {
      setError("Registration failed. " + (err.message || ""));
    }
    setLoading(false);
  };

  return (
    <Backdrop
      sx={{ color: "#222", backgroundColor: "rgba(0,0,0,0.7)", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
      onClick={onClose}
    >
      <Paper
        sx={{
          padding: 4,
          minWidth: 320,
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
        <Typography variant="h5" sx={{ color: "#111" }}>Register</Typography>
        <form onSubmit={handleRegister} style={{ width: "100%" }}>
          <TextField
            label="Nickname"
            fullWidth
            margin="normal"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            required
            InputProps={{ style: { backgroundColor: "#f5f5f5", color: "#222" } }}
          />
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
          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
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
            {loading ? <CircularProgress size={24} color="inherit" /> : "Register"}
          </Button>
        </form>
      </Paper>
    </Backdrop>
  );
};

export default RegisterModal;