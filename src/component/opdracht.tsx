import React, { useState, useEffect } from "react";
import { Box, Paper, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import { db, auth } from "../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

interface OpdrachtCard {
  id: string;
  title: string;
  content: string;
  deadline: string;
}

export default function OpdrachtPanel() {
  const [opdrachten, setOpdrachten] = useState<OpdrachtCard[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", deadline: "" });
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUid(user ? user.uid : null);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!uid) return;
    const fetchOpdrachten = async () => {
      const querySnapshot = await getDocs(collection(db, "opdrachten"));
      const list: OpdrachtCard[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        list.push({ id: docSnap.id, title: data.title, content: data.content, deadline: data.deadline });
      });
      setOpdrachten(list);
    };
    fetchOpdrachten();
  }, [uid, open]);

  const handleSave = async () => {
    if (!uid) return;
    await addDoc(collection(db, "opdrachten"), { ...form });
    setOpen(false);
    setForm({ title: "", content: "", deadline: "" });
  };

  return (
    <Box sx={{ width: "100%", p: 1, overflowX: "auto" }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>Opdrachten</Typography>
        <Button variant="contained" size="small" onClick={() => setOpen(true)}>+ Add taak</Button>
      </Box>
      <Box sx={{ display: "flex", gap: 2, overflowX: "auto" }}>
        {opdrachten.map((opdracht) => (
          <Paper
            key={opdracht.id}
            sx={{
              minWidth: 220,
              p: 2,
              background: "#fff",
              boxShadow: 1,
              borderRadius: 2,
              cursor: "default"
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>{opdracht.title}</Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>{opdracht.content}</Typography>
            <Typography variant="caption" sx={{ color: "#c00" }}>Deadline: {opdracht.deadline}</Typography>
          </Paper>
        ))}
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Taak</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField label="Title" name="title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          <TextField label="Contact" name="content" value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} multiline />
          <TextField label="Deadline" name="deadline" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} placeholder="如 2024-07-01" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cencel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}