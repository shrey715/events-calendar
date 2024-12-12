import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { Suspense } from 'react';
import Home from '@/components/pages/Home/Home';
import Calendar from '@/components/pages/Calendar/Calendar';
import Events from '@/components/pages/Events/Events';
import Loading from '@/components/pages/Handling/Loading';
import NotFound from '@/components/pages/Handling/NotFound';
import { CalendarProvider } from './components/contexts/CalendarContext';

export default function App() {
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calendar" element={
            <CalendarProvider>
              <Calendar />
            </CalendarProvider>
          } />
          <Route path="/events" element={<Events />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}