import { motion } from 'framer-motion';
import { useCalendarContext } from '../../contexts/CalendarContext';
import Header from './Header';
import WeekView from './WeekView';
import DayView from './DayView';
import MonthView from './MonthView';
import YearView from './YearView';

const Calendar = () => {
    const { currentView } = useCalendarContext();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-transparent p-5"
        >
            <Header />
            {currentView === 'year' && <YearView />}
            {currentView === 'month' && <MonthView />}
            {currentView === 'week' && <WeekView />}
            {currentView === 'day' && <DayView />}            
        </motion.div>
    );
};

export default Calendar;