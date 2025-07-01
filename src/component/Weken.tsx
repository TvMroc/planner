import { Box, Button, Card, Typography } from "@mui/material";
import { getDayOfWeek, weekFormat } from "./Methods";


const Weken = ({week, setWeek}: {week: number, setWeek: (arg0: number) => void}) => {
    const WeekItem = ({ itemWeek }: { itemWeek: number }) => (
        <Card onClick={() => setWeek(itemWeek)} sx={{ margin: '0.5em', padding: '1em', cursor: 'pointer', backgroundColor: itemWeek === (itemWeek === week ? itemWeek : null) ? '#e3f2fd' : 'white', transition: 'background 0.2s' }} elevation={3}>
            <Typography variant="h6">Week {itemWeek}</Typography>
            <Typography variant="body2">{getDayOfWeek(week, 0).toDateString()} - {getDayOfWeek(week, 6).toDateString()}</Typography>
        </Card>
    )

    return (
        <Box padding={'1em'} sx={{maxHeight: '82vh', height: '100%', overflowY: 'scroll'}}>
            <Typography variant="h3" sx={{width: '100%', textAlign: 'center'}}>Weken</Typography>
            <WeekItem itemWeek={weekFormat(week-2)} />
            <WeekItem itemWeek={weekFormat(week-1)} />
            <WeekItem itemWeek={week} />
            {Array.from({ length: 49 }, (_, i) => (
                <WeekItem key={i + 2} itemWeek={weekFormat(week+i + 1)} />
            ))}
        </Box>
    )
}

export default Weken;