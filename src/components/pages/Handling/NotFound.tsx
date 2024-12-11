import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-screen bg-transparent"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="text-6xl font-bold mb-4"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        404
      </motion.h1>
      <motion.p
        className="text-2xl mb-8"
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Page Not Found
      </motion.p>
      <Button variant={'secondary'}> 
        <Link to="/">
          Go back to Home
        </Link>
      </Button>
    </motion.div>
  );
};

export default NotFound;