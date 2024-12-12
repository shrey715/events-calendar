import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const YearView = ({ onMonthClick }: { onMonthClick: (date: Date) => void }) => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const handleNextYear = () => {
        setSelectedYear(selectedYear + 1);
    };

    const handlePrevYear = () => {
        setSelectedYear(selectedYear - 1);
    };

    const monthsInYear = Array.from({ length: 12 }).map((_, i) => {
        return new Date(selectedYear, i, 1);
    });

    return (
        <motion.div className="flex flex-col bg-transparent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <motion.div className="flex items-center justify-between p-4 border-b bg-transparent shadow-sm" initial={{ y: -20 }} animate={{ y: 0 }} transition={{ duration: 0.5 }}>
                <Button variant="ghost" onClick={handlePrevYear} className="rounded-full p-2 hover:bg-gray-100">
                    <ChevronLeft size={20} />
                </Button>
                <h2 className="text-lg font-semibold text-gray-800">
                    {selectedYear}
                </h2>
                <Button variant="ghost" onClick={handleNextYear} className="rounded-full p-2 hover:bg-gray-100">
                    <ChevronRight size={20} />
                </Button>
            </motion.div>

            <motion.div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg shadow-inner" initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
                {monthsInYear.map((date, index) => (
                    <div key={index} className="relative border border-gray-200 rounded-lg p-4 cursor-pointer" onClick={() => onMonthClick(date)}>
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