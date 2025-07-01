import { Box, Button, Typography } from "@mui/material";
import { getDayOfWeek, getWeek } from "./Methods";

const Weken = ({week, setWeek}: {week: number, setWeek: (arg0: number) => void}) => {
    return (<Box padding={'1em'}>
        <Typography variant="h3" sx={{width: '100%', textAlign: 'center'}}>Weken</Typography>
        <Box display={'flex'}><Button onClick={() => setWeek(week > 51 ? 1 : week+1)}>+</Button><Typography variant="h4" sx={{ padding: '0.5em' }}>{week}</Typography><Button  onClick={() => setWeek(week < 2 ? 52 : week-1)}>-</Button></Box>
        {getDayOfWeek(week, 6).toDateString()}
    </Box>)
}

export default Weken;