import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    type Event,
    sortEvents,
    getAllEvents
} from '@/api/event';
import { useState, useEffect } from 'react';
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

const DayView = ({ selectedDate, setSelectedDate }: { selectedDate: Date, setSelectedDate: (date: Date) => void }) => {
    const [eventsForDay, setEventsForDay] = useState<Event[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [refetch, setRefetch] = useState(false);
    const today = new Date();

    const fetchEvents = () => {
        try {
            const events = getAllEvents();
            const sortedEvents = sortEvents(events);
            const eventsForSelectedDay = sortedEvents.filter((event) => {
                const eventDate = new Date(event.date);
                return eventDate.toDateString() === selectedDate.toDateString();
            });

            setEventsForDay(eventsForSelectedDay);
        } catch {
            console.log("Error in DayView component");
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [selectedDate, refetch]);

    const handleNextDay = () => {
        setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 1)));
    };

    const handlePrevDay = () => {
        setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 1)));
    };

    const handleEventClick = (event: Event) => {
        setSelectedEvent(event); // when u click on an event it will open the update modal
    };

    const handleCloseModal = () => {
        setSelectedEvent(null);
        setRefetch(!refetch); 
    };

    const handleOpenAddModal = () => {
        setIsAddModalOpen(true); // when u click on the add event button it will open the add modal, or even when u click on the white space
    };

    const handleCloseAddModal = () => {
        setIsAddModalOpen(false);
        setRefetch(!refetch); 
    };

    return (
        <motion.div className="flex flex-col bg-transparent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <motion.div className="flex items-center justify-between p-4 border-b bg-transparent shadow-sm" initial={{ y: -20 }} animate={{ y: 0 }} transition={{ duration: 0.5 }}>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={handlePrevDay} className="rounded-full p-2 hover:bg-gray-100">
                        <ChevronLeft size={20} />
                    </Button>
                    <h2 className="text-lg font-semibold text-gray-800">
                        {selectedDate.toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                        })}
                    </h2>
                    <Button variant="ghost" onClick={handleNextDay} className="rounded-full p-2 hover:bg-gray-100">
                        <ChevronRight size={20} />
                    </Button>
                </div>
                <div className='flex items-center gap-4'>   
                    <Button
                        variant="default"
                        onClick={() => setSelectedDate(new Date())}
                        className={`${selectedDate.toDateString() === today.toDateString() ? 'hidden' : ''}`}
                    >
                        Today
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={handleOpenAddModal}
                    >
                        Add Event
                    </Button>
                </div>
            </motion.div>

            <motion.div className="flex flex-1 rounded-lg bg-gray-50 shadow-inner" initial={{ x: -100 }} animate={{ x:0 }} transition={{ duration: 0.5 }}>
                <div className="w-24 border-r bg-gray-100 rounded-l-lg">
                    {Array.from({ length: 24 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-16 border-b text-sm text-gray-500 flex items-start justify-end pr-3 pt-1"
                        >
                            {i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`}
                        </div>
                    ))}
                </div>

                <div className="flex-1 relative bg-white rounded-r-lg">
                    {Array.from({ length: 24 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-16 border-b border-gray-200 relative cursor-pointer"
                            onClick={() => setIsAddModalOpen(true)}
                        />
                    ))}

                    {selectedDate.toDateString() === today.toDateString() && (
                        <div
                            className="absolute w-full border-t-2 border-red-500 z-10"
                            style={{
                                top: `${(today.getHours() + today.getMinutes() / 60) * 64}px`,
                            }}
                        >
                            <div className="w-3 h-3 rounded-full bg-red-500 -mt-1.5 -ml-1.5" />
                        </div>
                    )}

                    {eventsForDay.map((event) => {
                        const startParts = event.startTime.split(':');
                        const endParts = event.endTime.split(':');
                        const startInMinutes = parseInt(startParts[0]) * 60 + parseInt(startParts[1]);
                        const endInMinutes = parseInt(endParts[0]) * 60 + parseInt(endParts[1]);
                        const duration = endInMinutes - startInMinutes;

                        return (
                            <motion.div
                                key={event.id}
                                className={cn("absolute font-bold left-4 right-4 rounded-lg p-3 shadow-lg flex flex-row gap-3 space-y-1 border border-gray-300 justify-start items-center cursor-pointer", colorMap[event.color])}
                                style={{
                                    top: `${(startInMinutes / 60) * 64}px`,
                                    height: `${(duration / 60) * 64}px`,
                                }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                onClick={() => handleEventClick(event)}
                            >
                                <h3 className="font-semibold text-sm text-white">{event.name}</h3>
                                <p className="text-xs text-white/80">{event.description}</p>
                                <span className="text-xs text-white/60">{`${event.startTime} - ${event.endTime}`}</span>
                            </motion.div>
                        );
                    })}
                </div>
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

export default DayView;