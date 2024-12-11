// Header.tsx
import { motion } from 'motion/react';
import { SquarePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogFooter,
    DialogTrigger,
    DialogTitle, 
    DialogClose
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useCalendarContext } from '../../contexts/CalendarContext';
import AddForm from '@/components/ui/addEvent';

const Header = () => {
    const { currentView, setCurrentView } = useCalendarContext();

    return(
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
            className='flex flex-row justify-between items-center bg-transparent p-2 w-full h-fit'
        >
            <Dialog>
                <DialogTrigger>
                    <Button>
                        <SquarePlus size={24} className='mr-2' />
                        Add Event
                    </Button>
                </DialogTrigger>
                <DialogContent className='text-zinc-800'>
                    <DialogHeader>
                        <DialogTitle>Add Event</DialogTitle>
                        <DialogDescription>
                            Add a new event to your calendar.
                        </DialogDescription>
                    </DialogHeader>
                    <AddForm />
                    <DialogFooter>
                        <DialogClose>
                            <Button variant='ghost'>Cancel</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <div className='flex flex-row justify-center items-center'>
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
            </div>
        </motion.header>
    );
}

export default Header;