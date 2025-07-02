import { useState, useEffect } from "react";
import { Box, Paper, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import { db, auth } from "./firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Dayjs } from "dayjs";

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

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailOpdracht, setDetailOpdracht] = useState<OpdrachtCard | null>(null);

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

  const handleShowDetail = (opdracht: OpdrachtCard) => {
    setDetailOpdracht(opdracht);
    setDetailOpen(true);
  };

  return (
    <Box sx={{ width: "100%", height: "100%", p: 1, overflowX: "auto", overflowY: "hidden", boxSizing: "border-box",display: "flex", flexDirection: "column", gap: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>Opdrachten</Typography>
        <Button variant="contained" size="small" onClick={() => setOpen(true)} sx={{ marginRight: 2 }}  >
          + Add taak
        </Button>
      </Box>
      <Box sx={{ display: "flex", gap: 2, overflowX: "auto" }}>
        {opdrachten.map((opdracht) => (
          <Paper
            key={opdracht.id}
            sx={{
              minWidth: 200,
              maxWidth: 200,
              minHeight: 100,
              p: 2,
              background: "#fff",
              boxShadow: 1,
              borderRadius: 2,
              cursor: "pointer",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}
            onClick={() => handleShowDetail(opdracht)}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: "bold",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
              }}
              title={opdracht.title}
            >
              {opdracht.title}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                mb: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
              }}
              title={opdracht.content}
            >
              {opdracht.content}
            </Typography>
            <Typography variant="caption" sx={{ color: "#c00" }}>
              Deadline: {opdracht.deadline}
            </Typography>
          </Paper>
        ))}
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Taak</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField label="Title" name="title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          <TextField label="Contact" name="content" value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} multiline />=
            <DatePicker
              label="Deadline"
              value={form.deadline ? new Dayjs(form.deadline) : null}
              onChange={date => {
                setForm(f => ({
                  ...f,
                  deadline: date ? date.toISOString().slice(0, 10) : ""
                }));
              }}
              format="dd-MM-yyyy"
              slotProps={{
                textField: {
                  variant: "outlined",
                  fullWidth: true
                }
              }}
            />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
      {/* 详细信息弹窗 */}
      <Dialog open={detailOpen} onClose={() => setDetailOpen(false)}>
        <DialogTitle>Opdracht</DialogTitle>
        <DialogContent sx={{ minWidth: 300 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
            {detailOpdracht?.title}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, whiteSpace: "pre-line" }}>
            {detailOpdracht?.content}
          </Typography>
          <Typography variant="caption" sx={{ color: "#c00" }}>
            Deadline: {detailOpdracht?.deadline}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailOpen(false)}>Sluit</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}