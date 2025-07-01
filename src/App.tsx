import { Grid, Paper, Typography } from "@mui/material"
import LoginModal from "./login"
import Weken from "./component/Weken"
import { useState } from "react";
import { getWeek } from "./component/Methods";


function App() {
  const [week, setWeek] = useState(getWeek(new Date));

  return (
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
            <Grid>
              <Paper sx={{ width: '100%', height: '100%', backgroundColor: '#d9d9d9', minHeight: '20vh' }} />
            </Grid>
            <Grid sx={{ flexGrow: 1 }}>
              <Paper sx={{ width: '100%', height: '100%', backgroundColor: '#d9d9d9' }} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default App
