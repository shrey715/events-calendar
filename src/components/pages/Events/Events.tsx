import { useState, useEffect } from 'react';
import { getAllEvents, type Event } from '@/api/event';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Search, Calendar, Type } from 'lucide-react';

const SearchEvents = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('');
    const [searchDate, setSearchDate] = useState('');

    useEffect(() => {
        const fetchEvents = async () => {
            const allEvents = await getAllEvents();
            setEvents(allEvents);
            setFilteredEvents(allEvents);
        };

        fetchEvents();
    }, []);

    /**
     * Filter events based on search term, type, and date
     * Using useEffect to update filteredEvents whenever searchTerm, searchType, or searchDate changes, while using javascript's inbuilt filter method
     */

    useEffect(() => {
        const filterEvents = () => {
            let filtered = events;

            if (searchTerm) { // Keyword based
                filtered = filtered.filter(event =>
                    event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    event.description.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            if (searchType) { // Type based
                filtered = filtered.filter(event => event.type.toLowerCase().includes(searchType.toLowerCase()));
            }

            if (searchDate) { // Date based
                filtered = filtered.filter(event => new Date(event.date).toDateString() === new Date(searchDate).toDateString());
            }

            setFilteredEvents(filtered);
        };

        filterEvents();
    }, [searchTerm, searchType, searchDate, events]);

    return (
        <motion.div 
            className="p-5 w-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className='flex flex-row justify-between items-center'>
                <h1 className="text-3xl font-bold mb-6 text-center text-pink-600">Search Events</h1>
                <Button variant="default" className="mb-6 flex items-center justify-center">
                    <Link to="/calendar" className="flex items-center">
                        <Calendar className="mr-2" />
                        Go to Calendar
                    </Link>
                </Button>
            </div>
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-3 text-zinc-800" />
                    <input
                        type="text"
                        placeholder="Search by name or description"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border p-3 pl-10 rounded w-full mb-2 text-zinc-800"
                    />
                </div>
                <div className="relative">
                <Type className="absolute left-3 top-3 text-zinc-800" />
                <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="border p-3 pl-10 rounded w-full mb-2 appearance-none text-zinc-800"
                >
                    <option value="">Select type</option>
                    <option value="personal">Personal</option>
                    <option value="work">Work</option>
                    <option value="social">Social</option>
                    <option value="family">Family</option>
                    <option value="other">Other</option>
                </select>
                </div>
                <div className="relative">
                    <Calendar className="absolute left-3 top-3 text-zinc-800" />
                    <input
                        type="date"
                        placeholder="Search by date"
                        value={searchDate}
                        onChange={(e) => setSearchDate(e.target.value)}
                        className="border p-3 pl-10 rounded w-full mb-2 text-zinc-800"
                    />
                </div>
            </div>
            <div>
                {filteredEvents.length > 0 ? (
                    <motion.ul
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        {filteredEvents.map(event => (
                            <motion.li 
                                key={event.id} 
                                className="border p-4 rounded mb-4 shadow-lg"
                                whileHover={{ scale: 1.05 }}
                            >
                                <h2 className="text-2xl font-bold mb-2">{event.name}</h2>
                                <p className="mb-2">{event.description}</p>
                                <p className="mb-2">Type: {event.type}</p>
                                <p className='mb-2'>Date: {new Date(event.date).toLocaleDateString()}</p>
                                <p>Time: {event.startTime} - {event.endTime}</p>
                            </motion.li>
                        ))}
                    </motion.ul>
                ) : (
                    <p className="text-center text-gray-500">No events found</p>
                )}
            </div>
        </motion.div>
    );
};

export default SearchEvents;