import { motion } from 'framer-motion';
import { useCalendarContext } from '../../contexts/CalendarContext';
import Header from './Header';
import DayView from './DayView';
import WeekView from './WeekView';
import MonthView from './MonthView';
import YearView from './YearView';
import { useState } from 'react';

const Calendar = () => {
    const { currentView, setCurrentView } = useCalendarContext();
    const [selectedDate, setSelectedDate] = useState(new Date()); //to keep track of the selected date and maintain it across views

    const handleDayClick = (date: Date) => {
        setSelectedDate(date);
        setCurrentView('day');
    };

    const handleMonthClick = (date: Date) => {
        setSelectedDate(date);
        setCurrentView('month');
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-transparent p-5"
        >
            <Header />
            {currentView === 'year' && <YearView onMonthClick={handleMonthClick} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />}
            {currentView === 'month' && <MonthView selectedDate={selectedDate} onDayClick={handleDayClick} setSelectedDate={setSelectedDate} />}
            {currentView === 'week' && <WeekView selectedDate={selectedDate} setSelectedDate={setSelectedDate} />}
            {currentView === 'day' && <DayView selectedDate={selectedDate} setSelectedDate={setSelectedDate} />}            
        </motion.div>
    );
};

export default Calendar;