import React, { useState, useEffect } from "react";
import { Box, Button, Paper, Typography, TextField, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Chip } from "@mui/material";
import { db, auth } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";

const days = [
  "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag", "Zondag"
];

interface PlanCard {
  title: string;
  content: string;
  time: string;
  deadline: string;
}

interface PlanBoardProps {
  week: number;
}

export default function PlanBoard({ week }: PlanBoardProps) {
  const [cards, setCards] = useState<PlanCard[][]>([[], [], [], [], [], [], []]);
  const [open, setOpen] = useState(false);
  const [currentDay, setCurrentDay] = useState(0);
  const [form, setForm] = useState({ title: "", content: "", time: "", deadline: "" });
  const [uid, setUid] = useState<string | null>(null);
  const [editIdx, setEditIdx] = useState<number | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUid(user ? user.uid : null);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!uid || !week) return;
    const fetchPlans = async () => {
      const docRef = doc(db, "plans", uid, "weeks", String(week));
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        setCards(days.map(day => data[day] || []));
      } else {
        setCards([[], [], [], [], [], [], []]);
      }
    };
    fetchPlans();
  }, [uid, week]);

  const savePlansToFirestore = async (newCards: PlanCard[][]) => {
    if (!uid || !week) return;
    const data: any = {};
    days.forEach((day, idx) => {
      data[day] = newCards[idx];
    });
    await setDoc(doc(db, "plans", uid, "weeks", String(week)), data);
  };

  const handleAddCard = (dayIdx: number) => {
    setCurrentDay(dayIdx);
    setForm({ title: "", content: "", time: "", deadline: "" });
    setEditIdx(null);
    setOpen(true);
  };

  const handleEditCard = (dayIdx: number, cardIdx: number) => {
    setCurrentDay(dayIdx);
    setForm({ ...cards[dayIdx][cardIdx] });
    setEditIdx(cardIdx);
    setOpen(true);
  };

  const handleDeleteCard = async (dayIdx: number, cardIdx: number) => {
    const newCards = [...cards];
    newCards[dayIdx] = newCards[dayIdx].filter((_, i) => i !== cardIdx);
    setCards(newCards);
    await savePlansToFirestore(newCards);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const newCards = [...cards];
    if (editIdx !== null) {
      // 编辑
      newCards[currentDay][editIdx] = { ...form };
    } else {
      // 新增
      newCards[currentDay].push({ ...form });
    }
    setCards(newCards);
    setOpen(false);
    setEditIdx(null);
    await savePlansToFirestore(newCards);
  };

  // 拖拽移动卡片
  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const fromDay = parseInt(source.droppableId);
    const toDay = parseInt(destination.droppableId);

    const newCards = [...cards];
    const [moved] = newCards[fromDay].splice(source.index, 1);
    newCards[toDay].splice(destination.index, 0, moved);

    setCards(newCards);
    await savePlansToFirestore(newCards);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        overflowX: "auto",
        overflowY: "hidden",
        p: 2,
        boxSizing: "border-box"
      }}
    >
      <DragDropContext onDragEnd={handleDragEnd}>
        <Box sx={{ display: "flex", width: "max-content", gap: 2, height: "100%", alignItems: "stretch" }}>
          {days.map((day, idx) => (
            <Paper key={day} sx={{ flex: "0 0 240px", background: "#222", color: "#fff", borderRadius: 3, p: 2, height: "100%", minHeight: 0, display: "flex", flexDirection: "column", alignItems: "center", boxSizing: "border-box" }}>
              <Typography variant="h5" sx={{ fontFamily: "cursive", mb: 1 }}>{day}</Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>totaal uur</Typography>
              <Droppable droppableId={String(idx)}>
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{ width: "100%", flex: 1, mb: 2, overflowY: "auto", display: "flex", flexDirection: "column" }}
                  >
                    {cards[idx].map((card, i) => (
                      <Draggable draggableId={`${idx}-${i}-${card.title}`} index={i} key={`${idx}-${i}-${card.title}`}>
                        {(provided, snapshot) => (
                          <Paper
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{
                              background: snapshot.isDragging ? "#ddd" : "#eee",
                              color: "#222",
                              p: 1,
                              mb: 1,
                              borderRadius: 2,
                              position: "relative",
                              boxShadow: snapshot.isDragging ? 6 : 1,
                              cursor: "grab"
                            }}
                          >
                            <Box sx={{ position: "absolute", right: 4, top: 4, display: "flex", gap: 0.5 }}>
                              <IconButton size="small" onClick={() => handleEditCard(idx, i)}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton size="small" onClick={() => handleDeleteCard(idx, i)}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                            <Typography variant="caption" sx={{ color: "#c00" }}>{card.deadline}</Typography>
                            <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>{card.title}</Typography>
                            <Typography variant="body2" noWrap maxWidth={'10vw'}>{card.content}</Typography>
                            <Typography variant="caption" sx={{ color: "#666" }}>{card.time}</Typography>
                          </Paper>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    <Button
                      variant="contained"
                      sx={{
                        background: "#ccc", color: "#222", fontFamily: "cursive", width: "100%",
                        borderRadius: 8, mt: "auto", "&:hover": { background: "#bbb" }
                      }}
                      onClick={() => handleAddCard(idx)}
                    >
                      + taak
                    </Button>
                  </Box>
                )}
              </Droppable>
            </Paper>
          ))}
        </Box>
      </DragDropContext>
      <Dialog open={open} onClose={() => { setOpen(false); setEditIdx(null); }}>
        <DialogTitle>{editIdx !== null ? "Bewerk taak" : "Nieuwe taak"}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField label="Titel" name="title" value={form.title} onChange={handleFormChange} />
          <TextField label="Beschrijving" name="content" value={form.content} onChange={handleFormChange} multiline />
          <TextField label="Tijd" name="time" value={form.time} onChange={handleFormChange} placeholder="如 15:00-16:00" />
          <TextField label="Deadline" name="deadline" value={form.deadline} onChange={handleFormChange} placeholder="如 1 Juli" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpen(false); setEditIdx(null); }}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}