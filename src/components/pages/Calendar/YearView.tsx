import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const YearView = ({ onMonthClick, selectedDate, setSelectedDate }: { onMonthClick: (date: Date) => void, selectedDate: Date, setSelectedDate: (date: Date) => void }) => {
    const today = new Date();

    const handleNextYear = () => {
        setSelectedDate(new Date(selectedDate.setFullYear(selectedDate.getFullYear() + 1)));
    };

    const handlePrevYear = () => {
        setSelectedDate(new Date(selectedDate.setFullYear(selectedDate.getFullYear() - 1)));
    };

    const handleMonthClick = (date: Date) => {
        onMonthClick(date);
    };

    const monthsInYear = Array.from({ length: 12 }).map((_, i) => {
        return new Date(selectedDate.getFullYear(), i, 1);
    });

    return (
        <motion.div className="flex flex-col bg-transparent h-[90vh]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <motion.div className="flex items-center justify-between p-4 border-b bg-transparent rounded-t-lg bg-gray-200" initial={{ y: -20 }} animate={{ y: 0 }} transition={{ duration: 0.5 }}>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={handlePrevYear} className="rounded-full p-2 hover:bg-gray-100 text-zinc-500">
                        <ChevronLeft size={20} />
                    </Button>
                    <h2 className="text-lg font-semibold text-gray-800">
                        {selectedDate.getFullYear()}
                    </h2>
                    <Button variant="ghost" onClick={handleNextYear} className="rounded-full p-2 hover:bg-gray-100 text-zinc-500">
                        <ChevronRight size={20} />
                    </Button>
                </div>
                <Button variant="default" onClick={() => setSelectedDate(new Date(today.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()))}>
                    Today
                </Button>
            </motion.div>

            <motion.div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-b-lg flex-grow" initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
                {monthsInYear.map((date, index) => (
                    <div
                        key={index}
                        className={cn("relative border border-gray-200 rounded-lg p-4 cursor-pointer", {
                            "bg-emerald-600 text-white": date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth(), 
                            "hover:bg-emerald-700 hover:text-white": date.getFullYear() === today.getFullYear() && date.getMonth() !== today.getMonth(), 
                            "hover:bg-sky-600": date.getFullYear() !== today.getFullYear() || date.getMonth() !== today.getMonth(), 
                        })}
                        onClick={() => handleMonthClick(date)}
                    >
                        <div className="text-lg font-semibold text-gray-800">
                            {date.toLocaleDateString('en-US', { month: 'long' })}
                        </div>
                    </div>
                ))}
            </motion.div>
        </motion.div>
    );
};

export default YearView;