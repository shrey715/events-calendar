import { createContext, useContext, useState, ReactNode } from 'react';

type ViewType = 'month' | 'week' | 'day' | 'year';

interface CalendarContextType {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export const CalendarProvider = ({ children }: { children: ReactNode }) => {
  const [currentView, setCurrentView] = useState<ViewType>('month');

  return (
    <CalendarContext.Provider value={{ currentView, setCurrentView }}>
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendarContext = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendarContext must be used within a CalendarProvider');
  }
  return context;
};