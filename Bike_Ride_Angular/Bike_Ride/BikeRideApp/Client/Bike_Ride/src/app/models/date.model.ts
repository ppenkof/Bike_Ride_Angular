export interface ScheduleDate{
    hour: string,
    day: string
    month: string,
    year: string
}


// export function encodeScheduleDate(schedule: ScheduleDate): string {
//     const { hour, day, month, year } = schedule;

//     // Pad values to ensure consistent formatting
//     const paddedHour = hour.padStart(2, '0');
//     const paddedDay = day.padStart(2, '0');
//     const paddedMonth = month.padStart(2, '0');

//     return `${paddedHour}${paddedDay}${paddedMonth}${year}`;
// }
//const encoded = encodeScheduleDate(schedule); // "1302032025"
//const encodedNumber = Number(encoded);