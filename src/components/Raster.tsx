import { useState } from "react";
import { Backdrop, Paper } from "@mui/material";
import { setDoc, doc, Timestamp, getDoc } from "firebase/firestore";
import { db } from "./firebase";

type Raster = {
    items: {
        start: Timestamp;
        end: Timestamp;
        day: number;
    }[]
}

const Raster = ({ open, onClose } : {open: boolean, onClose: () => void}) => {
  const [raster, setRaster] = useState<Raster>();
  const uid = localStorage.uid;
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const getRaster = async () => {
    try {
        await getDoc(doc(db, "users", uid, "raster")).then((rasterData) => {
        if (rasterData.exists()) setRaster(rasterData.data() as Raster);});
    } catch (error: any) {
      console.error("error:", error);
    }
}
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
    <Backdrop sx={{ color: "#222", backgroundColor: "rgba(0,0,0,0.7)"}} open={open} onClick={onClose}>
      <Paper>
        {days.map((day, index) => (
          <div key={index}>
            <p>{day}</p>
            {raster?.items.filter(i => i.day === index).map((item, id) => (
              <div key={id} style={{ padding: "10px", border: "1px solid #ccc", margin: "5px 0" }}>
                <p>Start: {item.start.toDate().toLocaleTimeString()}</p>
                <p>End: {item.end.toDate().toLocaleTimeString()}</p>
              </div>
            ))}
          </div>))}
      </Paper>
    </Backdrop>
  );
};

export default Raster;