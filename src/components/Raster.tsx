import { useEffect, useState } from "react";
import { Backdrop, Box, Button, Card, FormControl, InputLabel, MenuItem, Paper, Select, Typography } from "@mui/material";
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
  const [day, setDay] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const uid = localStorage.uid;

  const updateRaster = async () => {
    try {
      await setDoc(
        doc(db, "users", uid),
        { raster: raster?.items || [] },
        { merge: true }
      );
    } catch (error: any) {
      console.error("error:", error);
    }
  };

  useEffect(() => {
    if (loaded) updateRaster();
  },[raster]);

  const getRaster = async () => {
    try {
        await getDoc(doc(db, "users", uid)).then((userData) => {
        if (userData.exists()) {
          const data = (userData.data()) as {raster: {start: Timestamp; end: Timestamp; day: number;}[]};
          (data.raster) = data.raster.sort((a, b) => a.start.seconds - b.start.seconds);
          setRaster({ items: data.raster });
        }});
    } catch (error: any) {
      console.error("error:", error);
    }
  }

  useEffect(() => {
    getRaster();
    setLoaded(true);
  },[]);

  return (
    <>
        <Button onClick={() => setOpen(true)} sx={{ color: "#fff", backgroundColor: "#222", '&:hover': { backgroundColor: "#444" }, width: "100%" }} fullWidth variant="contained">Raster</Button>
        <Backdrop sx={{ color: "#222", backgroundColor: "rgba(0,0,0,0.7)", zIndex: 99}} open={open} onClick={() => setOpen(false)}>
            <Paper onClick={e => e.stopPropagation()} sx={{ padding: 2}}>
                <Typography variant="h5" gutterBottom>Plan when you can work</Typography>
                <Box sx={{display: 'flex', gap: 2, justifyContent: 'space-evenly'}}>
                    {days.map((day, index) => (
                    <Paper key={index} sx={{padding: 1}}>
                        <Typography>{day}</Typography>
                        {raster?.items.filter(i => i.day === index).map((item, id) => (
                        <Card key={id} style={{ padding: "0 5px", margin: "3px 0" }}>
                            <p>Start: {item.start.toDate().toLocaleTimeString()}</p>
                            <p>End: {item.end.toDate().toLocaleTimeString()}</p>
                        </Card>
                        ))}
                    </Paper>))}
                </Box>
                <Box display={'flex'} justifyContent={'space-between'} mt={2} maxWidth={1000} gap={2} flexWrap={'wrap'}>
                    <TimePicker  value={start} onChange={(value) => setStart(dayjs(value))} />
                    <TimePicker value={end} onChange={(value) => setEnd(dayjs(value))} />
                    <FormControl>
                        <InputLabel id="day-select-label">Day</InputLabel>
                        <Select labelId="day-select-label" id="day-select" value={day} label="Day" onChange={(e) => setDay(e.target.value)}> 
                            {days.map((day, index) => <MenuItem value={index}>{day}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <Button onClick={() => { (start && end) && setRaster(prev => ({ items: [...(prev?.items || []),{start: Timestamp.fromDate(start.toDate()),end: Timestamp.fromDate(end.toDate()),day}]}))}}>
                      Add time frame
                    </Button>
                </Box>
            </Paper>
        </Backdrop>
    </>
  );
};

export default Raster;