import {
    addDays,
    eachDayOfInterval,
    endOfMonth,
    format,
    isSameDay,
    startOfMonth,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface DatePickerModalProps {
    checkIn: string;
    checkOut: string;
    setCheckIn: (v: string) => void;
    setCheckOut: (v: string) => void;
    onClose: () => void;
    triggerRef?: React.RefObject<HTMLDivElement | null>;
    inline?: boolean;
}

export const DatePickerModal: React.FC<DatePickerModalProps> = ({
    checkIn,
    checkOut,
    setCheckIn,
    setCheckOut,
    onClose,
    triggerRef,
    inline = false,
}) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!inline && triggerRef?.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setPosition({
                top: rect.bottom + window.scrollY + 8,
                left: rect.left + window.scrollX,
            });
        }
    }, [triggerRef, inline]);

    const nextMonth = addDays(currentMonth, 30);
    const month1Start = startOfMonth(currentMonth);
    const month1End = endOfMonth(currentMonth);
    const month2Start = startOfMonth(nextMonth);
    const month2End = endOfMonth(nextMonth);
    const days1 = eachDayOfInterval({ start: month1Start, end: month1End });
    const days2 = eachDayOfInterval({ start: month2Start, end: month2End });

    const handleDateClick = (date: Date) => {
        const formatted = format(date, 'yyyy-MM-dd');
        if (!checkIn || (checkIn && checkOut)) {
            setCheckIn(formatted);
            setCheckOut('');
        } else if (checkIn && !checkOut && date >= new Date(checkIn)) {
            setCheckOut(formatted);
            onClose();
        } else {
            setCheckIn(formatted);
            setCheckOut('');
        }
    };

    const renderMonth = (days: Date[], monthDate: Date) => (
        <div className="flex-1">
            <div className="mb-2 text-center">
                <h3 className="text-lg font-semibold text-[#902729]">
                    {format(monthDate, 'MMMM yyyy')}
                </h3>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-600">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                    <div key={d}>{d}</div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-1 text-sm">
                {days.map((day, i) => {
                    const isSelected =
                        (checkIn && format(day, 'yyyy-MM-dd') === checkIn) ||
                        (checkOut && format(day, 'yyyy-MM-dd') === checkOut);
                    const inRange =
                        checkIn &&
                        checkOut &&
                        day >= new Date(checkIn) &&
                        day <= new Date(checkOut);
                    const isToday = isSameDay(day, new Date());
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const dayWithoutTime = new Date(day);
                    dayWithoutTime.setHours(0, 0, 0, 0);
                    return (
                        <button
                            key={i}
                            onClick={() => handleDateClick(day)}
                            disabled={dayWithoutTime < today}
                            className={`rounded-lg p-2 text-center transition-colors ${isSelected ? 'bg-[#902729] text-white' : 'text-black'} ${inRange && !isSelected ? 'bg-[#902729]/90 text-white' : ''} ${isToday ? 'font-bold text-[#902729]' : ''} ${dayWithoutTime < today ? 'cursor-not-allowed text-gray-400' : 'hover:bg-gray-400'} `}
                        >
                            {format(day, 'd')}
                        </button>
                    );
                })}
            </div>
        </div>
    );

    const calendarContent = (
        <div
            ref={dropdownRef}
            className={
                inline
                    ? 'w-full bg-white p-6'
                    : 'absolute z-52 w-auto overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl'
            }
            style={
                !inline
                    ? { top: `${position.top}px`, left: `${position.left}px` }
                    : undefined
            }
        >
            <div className="mb-4 flex items-center justify-between">
                <button
                    onClick={() => setCurrentMonth(addDays(currentMonth, -30))}
                    className="rounded p-2 hover:bg-gray-100"
                >
                    <ChevronLeft size={25} color="#902729" />
                </button>

                <button
                    onClick={() => setCurrentMonth(addDays(currentMonth, 30))}
                    className="rounded p-2 hover:bg-gray-100"
                >
                    <ChevronRight size={25} color="#902729" />
                </button>
            </div>

            <div className="flex flex-col gap-6 sm:flex-row sm:gap-4">
                {renderMonth(days1, currentMonth)}
                <div className="hidden sm:block sm:w-px sm:bg-gray-200" />
                {renderMonth(days2, nextMonth)}
            </div>
        </div>
    );

    if (inline) {
        return calendarContent;
    }

    return (
        <>
            <div
                className="pointer-events-none fixed inset-0 z-55"
                onClick={onClose}
            />
            {calendarContent}
        </>
    );
};
