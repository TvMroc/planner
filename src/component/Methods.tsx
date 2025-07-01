export const getWeek = (date: Date) => {
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    const week = new Date(date.getFullYear(), 0, 4);
    return 1 + Math.round(((date.getTime() - week.getTime()) / 86400000 - 3 + (week.getDay() + 6) % 7) / 7);
}

export const getDayOfWeek = (week: number, day: number, year?: number) => {
    const day1 = new Date(year ?? new Date().getFullYear(), 0, 4);
    const mondayOfWeek1 = new Date(day1);
    mondayOfWeek1.setDate(day1.getDate() - (day1.getDay() || 7 - 1));
    const result = new Date(mondayOfWeek1);
    result.setDate(mondayOfWeek1.getDate() + (week - 1) * 7 + day+1);
    return result;
}