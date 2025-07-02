import { Box, Card, Typography } from "@mui/material";
import { getDayOfWeek, getWeek, weekFormat } from "./DateFormatter";

const Weken = ({week, setWeek}: {week: number, setWeek: (arg0: number) => void}) => {
    const currentWeek = getWeek(new Date());
    const WeekItem = ({ itemWeek }: { itemWeek: number }) => (
        <Card onClick={() => setWeek(itemWeek)} sx={{ margin: '0.5em', padding: '1em', cursor: 'pointer', backgroundColor: itemWeek === (itemWeek === week ? itemWeek : null) ? '#e3f2fd' : 'white', transition: 'background 0.2s' }} elevation={3}>
            <Typography variant="h6">Week {itemWeek} {itemWeek == currentWeek && 'deze week'}</Typography>
            <Typography variant="body2">{getDayOfWeek(week, 0).toDateString()} - {getDayOfWeek(week, 6).toDateString()}</Typography>
        </Card>
    )

    return (
        <Box sx={{ padding: '1em', maxHeight: '82vh', height: '100%', overflowY: 'scroll', scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,0,0,0.1) transparent',
            '&::-webkit-scrollbar': { width: '8px', background: 'transparent' },
            '&::-webkit-scrollbar-thumb': { background: 'rgba(99, 99, 99, 0.1)', borderRadius: '4px'},
            '&::-webkit-scrollbar-track': { background: 'transparent' }}}
        >
            <Typography variant="h3" sx={{ width: '100%', textAlign: 'center' }}>Weken</Typography>
            {Array.from({ length: 52 }, (_, i) => (<WeekItem key={i + 2} itemWeek={weekFormat(week + i - 2)} />))}
        </Box>
    )
}

export default Weken;