import {
    addDays,
    eachDayOfInterval,
    endOfMonth,
    format,
    isSameDay,
    startOfMonth,
} from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
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
    const [monthDirection, setMonthDirection] = useState<'next' | 'prev'>(
        'next',
    );
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

    const goToPrevMonth = () => {
        setMonthDirection('prev');
        setCurrentMonth(addDays(currentMonth, -30));
    };

    const goToNextMonth = () => {
        setMonthDirection('next');
        setCurrentMonth(addDays(currentMonth, 30));
    };

    const slideVariants = {
        enter: (direction: string) => ({
            x: direction === 'next' ? 40 : -40,
            opacity: 0,
        }),
        center: { x: 0, opacity: 1 },
        exit: (direction: string) => ({
            x: direction === 'next' ? -40 : 40,
            opacity: 0,
        }),
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
                {Array.from({ length: days[0].getDay() }).map((_, i) => (
                    <div key={`empty-${i}`} />
                ))}
                {days.map((day, i) => {
                    const isSelected =
                        (checkIn && format(day, 'yyyy-MM-dd') === checkIn) ||
                        (checkOut && format(day, 'yyyy-MM-dd') === checkOut);
                    const inRange =
                        checkIn &&
                        checkOut &&
                        day > new Date(checkIn) &&
                        day < new Date(checkOut);
                    const isToday = isSameDay(day, new Date());
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const dayWithoutTime = new Date(day);
                    dayWithoutTime.setHours(0, 0, 0, 0);
                    const isPast = dayWithoutTime < today;

                    return (
                        <motion.button
                            key={i}
                            onClick={() => !isPast && handleDateClick(day)}
                            disabled={isPast}
                            whileHover={!isPast ? { scale: 1.15 } : {}}
                            whileTap={!isPast ? { scale: 0.9 } : {}}
                            transition={{
                                type: 'spring',
                                stiffness: 400,
                                damping: 25,
                            }}
                            className={`rounded-lg p-2 text-center text-sm transition-colors ${isSelected ? 'bg-[#902729] font-bold text-white shadow-md' : ''} ${inRange && !isSelected ? 'bg-[#902729]/20 font-medium text-[#902729]' : ''} ${isToday && !isSelected ? 'font-bold text-[#902729] ring-1 ring-[#902729]/40' : ''} ${isPast ? 'cursor-not-allowed text-gray-400' : 'cursor-pointer'} ${!isSelected && !inRange && !isPast ? 'text-gray-800 hover:bg-[#902729]/10' : ''} `}
                        >
                            {format(day, 'd')}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );

    const calendarContent = (
        <motion.div
            ref={dropdownRef}
            initial={{
                opacity: 0,
                y: inline ? 8 : 0,
                scale: inline ? 1 : 0.97,
            }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: inline ? 8 : 0, scale: inline ? 1 : 0.97 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className={
                inline
                    ? 'w-full rounded-2xl border border-[#b8924b]/20 bg-white p-6 shadow-sm'
                    : 'absolute z-52 w-auto overflow-y-auto rounded-2xl border border-[#b8924b]/20 bg-white p-6 shadow-2xl'
            }
            style={
                !inline
                    ? { top: `${position.top}px`, left: `${position.left}px` }
                    : undefined
            }
        >
            {/* Header row */}
            <div className="mb-5 flex items-center justify-between">
                <motion.button
                    onClick={goToPrevMonth}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="rounded-full p-2 transition-colors hover:bg-gray-100"
                >
                    <ChevronLeft size={22} color="#902729" />
                </motion.button>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={`header-${format(currentMonth, 'yyyy-MM')}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="text-sm font-semibold text-[#5a3e2b]"
                    >
                        {format(currentMonth, 'MMM')} –{' '}
                        {format(nextMonth, 'MMM yyyy')}
                    </motion.div>
                </AnimatePresence>

                <motion.button
                    onClick={goToNextMonth}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="rounded-full p-2 transition-colors hover:bg-gray-100"
                >
                    <ChevronRight size={22} color="#902729" />
                </motion.button>
            </div>

            <AnimatePresence mode="wait" custom={monthDirection}>
                <motion.div
                    key={format(currentMonth, 'yyyy-MM')}
                    custom={monthDirection}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="flex flex-col gap-6 sm:flex-row sm:gap-4"
                >
                    {renderMonth(days1, currentMonth)}
                    <div className="hidden sm:block sm:w-px sm:bg-gray-200" />
                    {renderMonth(days2, nextMonth)}
                </motion.div>
            </AnimatePresence>

            {/* Legend */}
            {(checkIn || checkOut) && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 flex items-center gap-6 border-t border-gray-100 pt-4 text-xs text-gray-500"
                >
                    {checkIn && (
                        <span className="flex items-center gap-1.5">
                            <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#902729]" />
                            Check-in: {format(new Date(checkIn), 'dd MMM yyyy')}
                        </span>
                    )}
                    {checkOut && (
                        <span className="flex items-center gap-1.5">
                            <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#902729]" />
                            Check-out:{' '}
                            {format(new Date(checkOut), 'dd MMM yyyy')}
                        </span>
                    )}
                </motion.div>
            )}
        </motion.div>
    );

    if (inline) {
        return calendarContent;
    }

    return (
        <AnimatePresence>
            <>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="pointer-events-auto fixed inset-0 z-50"
                    onClick={onClose}
                />
                {calendarContent}
            </>
        </AnimatePresence>
    );
};
