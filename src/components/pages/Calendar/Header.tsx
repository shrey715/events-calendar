// Header.tsx
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useCalendarContext } from '../../contexts/CalendarContext';
import { CalendarDaysIcon } from 'lucide-react';
import { DownloadIcon } from 'lucide-react';
import {
    getAllEvents,
    sortEvents
} from '@/api/event';
import { Link } from 'react-router';

const Header = () => {
    const { currentView, setCurrentView } = useCalendarContext();

    const onDownloadClick = () => {
        const events = getAllEvents();
        if (events.length === 0) return alert('No events to download');
        const sortedEvents = sortEvents(events);
        const blob = new Blob([JSON.stringify(sortedEvents)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'calendrify-events.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    return(
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
            className='flex flex-row justify-between items-center bg-transparent p-2 w-full h-fit'
        >
            <div className='flex flex-row justify-center items-center text-gray-200'>
                <Link to='/' className='flex flex-row justify-around items-center'>
                    <CalendarDaysIcon className='mr-2' />
                    <h1 className='text-2xl font-bold'>Calendrify</h1>
                </Link>
            </div>
            <div className='flex flex-row justify-center items-center gap-5'>
                <Button>
                    <Link to='/events'>Go to Events</Link>
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button>
                            <span className='mr-2'>View: </span>
                            {currentView.charAt(0).toUpperCase() + currentView.slice(1)}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>View</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setCurrentView('year')}>Year</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setCurrentView('month')}>Month</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setCurrentView('week')}>Week</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setCurrentView('day')}>Day</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <Button
                    variant='default'
                    onClick={onDownloadClick}
                >
                    <DownloadIcon />
                    <span className='ml-2'>Download Events</span>
                </Button>
            </div>
        </motion.header>
    );
}

export default Header;