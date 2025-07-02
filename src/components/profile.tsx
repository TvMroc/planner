import React from "react";
import { Backdrop, Paper, Typography, Button } from "@mui/material";
import Raster from "./Raster";

interface ProfileModalProps {
  open: boolean;
  nickname: string | null;
  onLogout: () => void;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ open, nickname, onLogout, onClose }) => (
  <Backdrop
    sx={{ color: "#222", backgroundColor: "rgba(0,0,0,0.7)", zIndex: (theme) => theme.zIndex.drawer + 1 }}
    open={open}
    onClick={onClose}
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
      <Typography variant="h5" sx={{ color: "#111" }}>Profile</Typography>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>Nickname: {nickname}</Typography>
      <Raster />
      <Button
        onClick={onLogout}
        sx={{ color: "#fff", backgroundColor: "#222", '&:hover': { backgroundColor: "#444" }, width: "100%" }}
        fullWidth
        variant="contained"
      >
        Logout
      </Button>
    </Paper>
  </Backdrop>
);

export default ProfileModal;