export const calculateNights = (checkIn: string, checkOut: string): number => {
    if (!checkIn || !checkOut) return 1;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
};

export const getEaster = (year: number) => {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(year, month - 1, day);
};

export const isHoliday = (date: Date): boolean => {
    const month = date.getMonth();
    const day = date.getDate();
    if (month === 11 && (day === 24 || day === 25 || day === 26)) return true;

    const year = date.getFullYear();
    const easter = getEaster(year);
    const goodFriday = new Date(easter);
    goodFriday.setDate(easter.getDate() - 2);
    const easterSaturday = new Date(easter);
    easterSaturday.setDate(easter.getDate() - 1);
    const easterMonday = new Date(easter);
    easterMonday.setDate(easter.getDate() + 1);

    return [goodFriday, easterSaturday, easter, easterMonday].some(
        (d) => d.getTime() === date.getTime(),
    );
};
