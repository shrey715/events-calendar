import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { type Event, sortEvents, getAllEvents } from '@/api/event';
import { cn } from '@/lib/utils';
import UpdateModal from '@/components/ui/updateModal';
import AddModal from '@/components/ui/addModal';

const colorMap = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
};

const MonthView = ({ selectedDate, onDayClick, setSelectedDate }: { selectedDate: Date, onDayClick: (date: Date) => void, setSelectedDate: (date: Date) => void }) => {
    const [eventsForMonth, setEventsForMonth] = useState<{ [key: string]: Event[] }>({});
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [refetch, setRefetch] = useState(false);

    useEffect(() => {
        setSelectedDate(selectedDate);
    }, [selectedDate]);

    useEffect(() => {
        try {
            const events = getAllEvents();
            const sortedEvents = sortEvents(events);
            const startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
            const endOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);

            const eventsForSelectedMonth = sortedEvents.reduce((acc, event) => {
                const eventDate = new Date(event.date);
                if (eventDate >= startOfMonth && eventDate <= endOfMonth) {
                    const dateString = eventDate.toDateString();
                    if (!acc[dateString]) {
                        acc[dateString] = [];
                    }
                    acc[dateString].push(event);
                }
                return acc;
            }, {} as { [key: string]: Event[] });

            setEventsForMonth(eventsForSelectedMonth);
        } catch {
            console.log("Error in MonthView component");
        }

    }, [selectedDate, refetch]);

    const handleNextMonth = () => {
        setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)));
    };

    const handlePrevMonth = () => {
        setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)));
    };

    const handleCloseModal = () => {
        setSelectedEvent(null);
        setRefetch(!refetch); 
    };

    const handleCloseAddModal = () => {
        setIsAddModalOpen(false);
        setRefetch(!refetch); 
    };

    const daysInMonth = Array.from({ length: new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate() }).map((_, i) => {
        const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i + 1);
        return date;
    });

    return (
        <motion.div className="flex flex-col bg-transparent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <motion.div className="flex items-center justify-between p-4 border-b bg-transparent shadow-sm" initial={{ y: -20 }} animate={{ y: 0 }} transition={{ duration: 0.5 }}>
                <Button variant="ghost" onClick={handlePrevMonth} className="rounded-full p-2 hover:bg-gray-100">
                    <ChevronLeft size={20} />
                </Button>
                <h2 className="text-lg font-semibold text-gray-800">
                    {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h2>
                <Button variant="ghost" onClick={handleNextMonth} className="rounded-full p-2 hover:bg-gray-100">
                    <ChevronRight size={20} />
                </Button>
            </motion.div>

            <motion.div className="grid grid-cols-7 gap-2 p-4 bg-gray-50 rounded-lg shadow-inner" initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
                {daysInMonth.map((date, index) => (
                    <div key={index} className="relative border border-gray-200 rounded-lg p-2 cursor-pointer" onClick={() => onDayClick(date)}>
                        <div className="text-sm font-semibold text-gray-800">
                            {date.getDate()}
                        </div>
                        {eventsForMonth[date.toDateString()]?.map((event, i) => (
                            <div key={i} className={cn("mt-1 h-1 rounded-full", colorMap[event.color])} />
                        ))}
                    </div>
                ))}
            </motion.div>

            {selectedEvent && (
                <UpdateModal isOpen={!!selectedEvent} onClose={handleCloseModal} event={selectedEvent} />
            )}

            {isAddModalOpen && (
                <AddModal isOpen={isAddModalOpen} onClose={handleCloseAddModal} />
            )}
        </motion.div>
    );
};

export default MonthView;