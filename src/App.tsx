import { Grid, Paper, Typography } from "@mui/material"

function App() {

  return (
    // <Paper sx={{maxHeight: '100vh', maxWidth: '100vw', height: '98vh', padding: 0, margin: 0}}>
    //   <Grid container spacing={3} padding={1} sx={{height: '100%', width: '100%'}}>
    //     <Grid size={12} sx={{backgroundColor: '#606060', borderRadius: '12px', color: 'white', display: 'flex', justifyContent: 'space-between', padding: '0 0.5em'}} >
    //      <Typography variant="h2">Planner</Typography>
    //      <p>login</p></Grid>
    //     <Grid size={12} container spacing={3} height={'100%'}>
    //       <Grid size={2.5}>
    //         <Paper sx={{width: '100%', height: '100%', backgroundColor: '#d9d9d9'}}>

    //         </Paper>
    //       </Grid>
    //       <Grid size={9.5} container spacing={2} direction={'column'} height={'100%'}>
    //         <Grid size={3}>
    //           <Paper sx={{width: '100%', height: '100%', backgroundColor: '#d9d9d9'}}>

    //           </Paper>
    //         </Grid>
    //         <Grid size={9}>
    //           <Paper sx={{width: '100%', height: '100%', backgroundColor: '#d9d9d9'}}>

    //           </Paper>
    //         </Grid>
    //       </Grid>
    //     </Grid>
    //   </Grid>
    // </Paper>
    <Paper sx={{maxHeight: '100vh', maxWidth: '100vw', height: '98vh', padding: 0, margin: 0}}>
      <Grid container direction={"column"} spacing={3} padding={1} sx={{height: '100%', width: '100%'}}>
        <Grid size={3} sx={{width: "100%", backgroundColor: '#606060', borderRadius: '12px', color: 'white', display: 'flex', justifyContent: 'space-between', padding: '0 0.5em'}} >
         <Typography variant="h2">Planner</Typography>
         <p>login</p></Grid>
        <Grid size={9} container spacing={3} width={'100%'} height={'86vh'}>
          <Grid size={3}>
            <Paper sx={{width: '100%', height: '100%', backgroundColor: '#d9d9d9', }}></Paper>
          </Grid>
          <Grid size={9}>
            <Paper sx={{width: '100%', height: '100%', backgroundColor: '#d9d9d9'}}></Paper>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default App
