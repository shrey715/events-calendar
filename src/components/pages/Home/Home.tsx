import { motion } from 'motion/react';
import { CalendarDays } from 'lucide-react';
import { Link } from 'react-router';

const Home = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex flex-col items-center justify-center max-w-3xl mx-auto px-6 py-8"
    >
      <div
        className='h-fit flex flex-col items-center gap-8 text-center justify-center glass p-5' 
      >  
        <motion.h1 
          className="flex flex-col items-center gap-6 text-4xl md:text-5xl font-bold text-gray-100 mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <CalendarDays className="w-24 h-24 md:w-32 md:h-32 text-emerald-500" />
          </motion.div>
          Welcome to Calendrify!
        </motion.h1>

        <p className="text-lg text-gray-300 leading-relaxed mb-8 text-center">
          Calendrify is dynamic event calendar, designed to help keep track of events 
          and appointments on a simple, easy-to-use interface. It allows you to create, 
          update, and delete events, as well as view them in a calendar format, letting 
          you download all your event history as a JSON file. All this happens locally 
          and nothing is stored on a server.
        </p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Link 
            to="/calendar" 
            className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-8 rounded-lg transition-transform hover:-translate-y-2 duration-500"
          >
            Go to Calendar
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Home;