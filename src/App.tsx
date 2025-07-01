import { Grid, Paper, Typography } from "@mui/material"

function App() {

  return (
    <Paper sx={{ maxHeight: '100vh', maxWidth: '100vw', height: '98vh', padding: 0, margin: 0 }}>
      <Grid container direction="column" spacing={3} padding={1} sx={{ height: '100%', width: '100%' }}>
        <Grid sx={{ width: "100%", backgroundColor: '#606060', borderRadius: '12px', color: 'white', display: 'flex', justifyContent: 'space-between', padding: '0 0.5em' }}>
          <Typography variant="h2">Planner</Typography>
          <p>login</p>
        </Grid>
        <Grid container direction="row" spacing={3} sx={{ width: '100%', height: '86vh' }}>
          <Grid size={2}>
            <Paper sx={{ width: '100%', height: '100%', backgroundColor: '#d9d9d9' }}>
              <Typography variant="h3" sx={{width: '100%', textAlign: 'center', padding: '0.3em 0 0 0'}}>Weken</Typography>
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
