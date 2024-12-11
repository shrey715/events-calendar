import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCalendarContext } from '../../contexts/CalendarContext';
import Header from './Header';
import {
    type Event,
    sortEvents,
    getAllEvents
} from '@/api/event';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const colorMap = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
};

const DayView = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [eventsForDay, setEventsForDay] = useState<Event[]>([]);
    const today = new Date();

    useEffect(() => {
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

    }, [selectedDate]);

    const handleNextDay = () => {
        setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 1)));
    };

    const handlePrevDay = () => {
        setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 1)));
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
                <Button
                    variant="destructive"
                    onClick={() => setSelectedDate(new Date())}
                    className={`rounded-md bg-red-500 text-white px-4 py-2 shadow-md hover:bg-red-600 transition ${selectedDate.toDateString() === today.toDateString() ? 'hidden' : ''}`}
                >
                    Today
                </Button>
            </motion.div>

            <motion.div className="flex flex-1 rounded-lg bg-gray-50 shadow-inner" initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
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
                            className="h-16 border-b border-gray-200 relative"
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
                                className={cn("absolute font-bold left-4 right-4 rounded-lg p-3 shadow-lg flex flex-row gap-3 space-y-1 border border-gray-300 justify-start items-center", colorMap[event.color])}
                                style={{
                                    top: `${(startInMinutes / 60) * 64}px`,
                                    height: `${(duration / 60) * 64}px`,
                                }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <h3 className="font-semibold text-sm text-white">{event.name}</h3>
                                <p className="text-xs text-white/80">{event.description}</p>
                                <span className="text-xs text-white/60">{`${event.startTime} - ${event.endTime}`}</span>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>
        </motion.div>
    );
};

const WeekView = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [eventsForWeek, setEventsForWeek] = useState<{ [key: string]: Event[] }>({});
    const today = new Date();

    useEffect(() => {
        try {
            const events = getAllEvents();
            const sortedEvents = sortEvents(events);
            const startOfWeek = new Date(selectedDate);
            startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);

            const eventsForSelectedWeek = sortedEvents.reduce((acc, event) => {
                const eventDate = new Date(event.date);
                if (eventDate >= startOfWeek && eventDate <= endOfWeek) {
                    const dateString = eventDate.toDateString();
                    if (!acc[dateString]) {
                        acc[dateString] = [];
                    }
                    acc[dateString].push(event);
                }
                return acc;
            }, {} as { [key: string]: Event[] });

            setEventsForWeek(eventsForSelectedWeek);
        } catch {
            console.log("Error in WeekView component");
        }

    }, [selectedDate]);

    const handleNextWeek = () => {
        setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 7)));
    };

    const handlePrevWeek = () => {
        setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 7)));
    };

    const daysOfWeek = Array.from({ length: 7 }).map((_, i) => {
        const date = new Date(selectedDate);
        date.setDate(selectedDate.getDate() - selectedDate.getDay() + i);
        return date;
    });

    return (
        <motion.div className="flex flex-col bg-transparent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <motion.div className="flex items-center justify-between p-4 border-b bg-transparent shadow-sm" initial={{ y: -20 }} animate={{ y: 0 }} transition={{ duration: 0.5 }}>
                <Button variant="ghost" onClick={handlePrevWeek} className="rounded-full p-2 hover:bg-gray-100">
                    <ChevronLeft size={20} />
                </Button>
                <h2 className="text-lg font-semibold text-gray-800">
                    {`${daysOfWeek[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - ${daysOfWeek[6].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`}
                </h2>
                <Button variant="ghost" onClick={handleNextWeek} className="rounded-full p-2 hover:bg-gray-100">
                    <ChevronRight size={20} />
                </Button>
            </motion.div>

            <motion.div className="flex flex-1 flex-col rounded-lg bg-gray-50 shadow-inner" initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
                <div className="grid grid-cols-7 border-b bg-gray-100 rounded-t-lg">
                    {daysOfWeek.map((date, index) => (
                        <div key={index} className="text-center font-semibold text-gray-800 py-2">
                            {date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}
                        </div>
                    ))}
                </div>
                <div className="flex flex-1">
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

                    <div className="flex-1 relative bg-white rounded-r-lg grid grid-cols-7">
                        {daysOfWeek.map((date, index) => (
                            <div key={index} className="relative border-r border-gray-200">
                                {Array.from({ length: 24 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-16 border-b border-gray-200 relative"
                                    />
                                ))}
                                {date.toDateString() === today.toDateString() && (
                                    <div
                                        className="absolute w-full border-t-2 border-red-500 z-10"
                                        style={{
                                            top: `${(today.getHours() + today.getMinutes() / 60) * 64}px`,
                                        }}
                                    >
                                        <div className="w-3 h-3 rounded-full bg-red-500 -mt-1.5 -ml-1.5" />
                                    </div>
                                )}
                                {eventsForWeek[date.toDateString()]?.map((event) => {
                                    const startParts = event.startTime.split(':');
                                    const endParts = event.endTime.split(':');
                                    const startInMinutes = parseInt(startParts[0]) * 60 + parseInt(startParts[1]);
                                    const endInMinutes = parseInt(endParts[0]) * 60 + parseInt(endParts[1]);
                                    const duration = endInMinutes - startInMinutes;

                                    return (
                                        <motion.div
                                            key={event.id}
                                            className={cn("absolute font-bold left-4 right-4 rounded-lg p-3 shadow-lg flex flex-row gap-3 space-y-1 border border-gray-300 justify-start items-center", colorMap[event.color])}
                                            style={{
                                                top: `${(startInMinutes / 60) * 64}px`,
                                                height: `${(duration / 60) * 64}px`,
                                            }}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <h3 className="font-semibold text-sm text-white">{event.name}</h3>
                                            <p className="text-xs text-white/80">{event.description}</p>
                                            <span className="text-xs text-white/60">{`${event.startTime} - ${event.endTime}`}</span>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

const Calendar = () => {
    const { currentView } = useCalendarContext();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-transparent p-5 h-screen"
        >
            <Header />
            {currentView === 'week' && <WeekView />}
            {currentView === 'day' && <DayView />}            
        </motion.div>
    );
};

export default Calendar;