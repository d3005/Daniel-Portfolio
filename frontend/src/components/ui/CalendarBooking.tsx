import { motion } from 'framer-motion';
import { Calendar, Clock, ExternalLink } from 'lucide-react';

interface CalendarBookingProps {
  calendarUrl?: string;
}

export default function CalendarBooking({ 
  calendarUrl = 'https://calendar.app.google/F7aLphveqQ7rNZm58'
}: CalendarBookingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-6 rounded-2xl"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-accent-purple/20 flex items-center justify-center flex-shrink-0">
          <Calendar className="w-6 h-6 text-accent-purple" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-dark-100 mb-2">
            Schedule a Meeting
          </h3>
          <p className="text-dark-400 text-sm mb-4">
            Book a time slot for a quick chat about opportunities, projects, or collaborations.
          </p>
          
          <motion.a
            href={calendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent-purple/20 hover:bg-accent-purple/30 text-accent-purple rounded-lg transition-colors"
          >
            <Clock className="w-4 h-4" />
            <span>Book a Call</span>
            <ExternalLink className="w-4 h-4" />
          </motion.a>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-dark-700/50">
        <p className="text-xs text-dark-500">
          Response time: Usually within 24 hours
        </p>
      </div>
    </motion.div>
  );
}