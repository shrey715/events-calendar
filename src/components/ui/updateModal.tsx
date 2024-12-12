import React from 'react';
import { motion } from 'framer-motion';
import { X } from "lucide-react";
import UpdateForm from '@/components/ui/updateEvent';
import { Event } from '@/api/event';

interface UpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
}

const UpdateModal: React.FC<UpdateModalProps> = ({ isOpen, onClose, event }) => {
  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 text-zinc-800">
      <motion.div
        className="bg-white rounded-lg shadow-lg p-6"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-lg font-semibold mb-4 flex justify-between">
          <span className="text-zinc-800">Update Event</span>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <UpdateForm event={event} onClose={onClose} />
      </motion.div>
    </div>
  );
};

export default UpdateModal;