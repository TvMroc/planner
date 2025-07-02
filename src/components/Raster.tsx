import { useEffect, useState } from "react";
import { Backdrop, Box, Button, Paper, Typography } from "@mui/material";
import { setDoc, doc, Timestamp, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { TimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";

type Raster = {
    items: {
        start: Timestamp;
        end: Timestamp;
        day: number;
    }[]
}

const Raster = () => {
  const [raster, setRaster] = useState<Raster>();
  const [open, setOpen] = useState(false);
  const [start, setStart] = useState<Dayjs | null>(dayjs());
  const [end, setEnd] = useState<Dayjs | null>(dayjs());
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const uid = localStorage.uid;

  const getRaster = async () => {
    try {
        await getDoc(doc(db, "users", uid, "raster")).then((rasterData) => {
        if (rasterData.exists()) setRaster(rasterData.data() as Raster);});
    } catch (error: any) {
      console.error("error:", error);
    }
  }
  useEffect(() => {
    getRaster();
  },[])

  const updateRaster = async () => {
    try {
      await setDoc(doc(db, "users", uid, "raster"), {
        ...raster
      });
    } catch (error: any) {
      console.error("error:", error);
    }
  };

  return (
    <>
        <Button onClick={() => setOpen(true)} sx={{ color: "#fff", backgroundColor: "#222", '&:hover': { backgroundColor: "#444" }, width: "100%" }} fullWidth variant="contained">Raster</Button>
        <Backdrop sx={{ color: "#222", backgroundColor: "rgba(0,0,0,0.7)", zIndex: 99}} open={open} onClick={() => setOpen(false)}>
            <Paper onClick={e => e.stopPropagation()} sx={{ padding: 2}}>
                <Typography variant="h5" gutterBottom>Plan when you can work</Typography>
                <Box sx={{display: 'flex', gap: 2}}>
                    {days.map((day, index) => (
                    <div key={index}>
                        <Typography>{day}</Typography>
                        {raster?.items.filter(i => i.day === index).map((item, id) => (
                        <div key={id} style={{ padding: "10px", border: "1px solid #ccc", margin: "5px 0" }}>
                            <p>Start: {item.start.toDate().toLocaleTimeString()}</p>
                            <p>End: {item.end.toDate().toLocaleTimeString()}</p>
                        </div>
                        ))}
                    </div>))}
                </Box>
                <Box display={'flex'} justifyContent={'space-between'} mt={2}>
                    <TimePicker value={start} onChange={(value) => setStart(value)} />
                    <TimePicker value={end} onChange={(value) => setEnd(value)} />
                </Box>
            </Paper>
        </Backdrop>
    </>
  );
};

export default Raster;