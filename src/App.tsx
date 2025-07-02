import { Grid, Paper, Typography } from "@mui/material"
import LoginModal from "./login"
import Weken from "./component/Weken"
import { useState, useRef } from "react";
import { getWeek } from "./component/Methods";
import PlanBoard from "./component/Plannen";
import OpdrachtPanel from "./component/opdracht";


function App() {
  const [week, setWeek] = useState(getWeek(new Date));
  const planBoardRef = useRef<any>(null);


  return (
    <>
      <Paper sx={{ maxHeight: '100vh', maxWidth: '100vw', height: '98vh', padding: 0, margin: 0 }}>
        <Grid container direction="column" spacing={3} padding={1} sx={{ height: '100%', width: '100%' }}>
          <Grid sx={{ width: "100%", backgroundColor: '#606060', borderRadius: '12px', color: 'white', display: 'flex', justifyContent: 'space-between', padding: '0 0.5em', alignItems: 'center' }}>
            <Typography variant="h2">Planner</Typography>
            <LoginModal />
          </Grid>
          <Grid container direction="row" spacing={3} sx={{ width: '100%', height: '86vh', maxHeight: '100%' }}>
            <Grid size={2}>
              <Paper sx={{ width: '100%', height: '100%', maxHeight: '100%', backgroundColor: '#d9d9d9', overflow: 'auto' }}>
                <Weken week={week} setWeek={setWeek}/>
              </Paper>
            </Grid>
            <Grid size={10} container direction="column" spacing={3}>
              <Grid sx={{ maxWidth: '80.8vw' }}>
                <Paper sx={{ width: '100%', height: '100%', backgroundColor: '#d9d9d9', minHeight: '20vh', p: 1 }}>
                  <OpdrachtPanel />
                </Paper>
              </Grid>
              <Grid sx={{ flexGrow: 1, maxWidth: '81.6vw' }}>
                <Paper sx={{ width: '100%', height: '100%', backgroundColor: '#d9d9d9', overflow: 'hidden', display: 'flex', flexDirection: 'column'}} >
                  <PlanBoard ref={planBoardRef} week={week} />
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </>
  )
}

export default App
