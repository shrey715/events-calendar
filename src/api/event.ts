enum EventType {
    personal = 'personal',
    work = 'work',
    social = 'social',
    family = 'family',
    other = 'other'
}

enum EventColor {
    personal = 'blue',
    work = 'green',
    social = 'yellow',
    family = 'purple',
    other = 'red'
}

interface Event {
    id: number;
    name: string;
    date: string;
    description: string;
    startTime: string;
    endTime: string;
    type: EventType;
    color: EventColor;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// used in the front-end
const sortEvents = (events: Event[]): Event[] => {
    return events.sort((a, b) => {
        const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime();
        if (dateCompare !== 0) return dateCompare;

        return a.startTime.localeCompare(b.startTime);
    });
};

const getAllEvents = (): Event[] => {
    const events = localStorage.getItem('events');
    return events ? JSON.parse(events) : [];
}

const addNewEvent = (event: Event): void => {
    const events = getAllEvents();

    const hasConflict = events.some(existingEvent => 
        existingEvent.date === event.date &&
        ((event.startTime >= existingEvent.startTime && event.startTime < existingEvent.endTime) ||
        (event.endTime > existingEvent.startTime && event.endTime <= existingEvent.endTime) ||
        (event.startTime <= existingEvent.startTime && event.endTime >= existingEvent.endTime))
    );

    if (hasConflict) {
        throw new Error('Event conflicts with an existing event.');
    }

    events.push(event);
    localStorage.setItem('events', JSON.stringify(events));
}

const deleteEvent = (id: number): void => {
    const events = getAllEvents();
    const newEvents = events.filter((event: Event) => event.id !== id);
    localStorage.setItem('events', JSON.stringify(newEvents));
}

const updateEvent = (id: number, updatedEvent: Event): void => {
    const events = getAllEvents();

    const hasConflict = events.some(existingEvent => 
        existingEvent.id !== id &&
        existingEvent.date === updatedEvent.date &&
        ((updatedEvent.startTime >= existingEvent.startTime && updatedEvent.startTime < existingEvent.endTime) ||
        (updatedEvent.endTime > existingEvent.startTime && updatedEvent.endTime <= existingEvent.endTime) ||
        (updatedEvent.startTime <= existingEvent.startTime && updatedEvent.endTime >= existingEvent.endTime))
    );

    if (hasConflict) {
        throw new Error('Event conflicts with an existing event.');
    }

    const newEvents = events.map((event: Event) => event.id === id ? updatedEvent : event);
    localStorage.setItem('events', JSON.stringify(newEvents));
}

export {
    type Event,
    EventType,
    EventColor,
    sortEvents,
    getAllEvents,
    addNewEvent,
    deleteEvent,
    updateEvent,
}