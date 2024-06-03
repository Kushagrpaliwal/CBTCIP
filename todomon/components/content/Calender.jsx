import React, { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { db, auth } from '@/constants/firebaseConfig';
import { collection, addDoc, getDocs, query, deleteDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const Calendar = () => {
  const calendarRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [calendarHeight, setCalendarHeight] = useState(window.innerHeight * 0.8); // Set initial height

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await fetchEvents(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setCalendarHeight(window.innerHeight * 0.8); // Update height when window is resized
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const fetchEvents = async (uid) => {
    const q = query(collection(db, "users", uid, "events"));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setEvents(data);
  };

  const handleEventAdd = async (info) => {
    try {
      const newEvent = { title: info.event.title, date: info.event.startStr };
      await addDoc(collection(db, "users", auth.currentUser.uid, "events"), newEvent);
      await fetchEvents(auth.currentUser.uid); // Fetch events again after adding
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const handleDateClick = (arg) => {
    const title = prompt('Enter event title:');
    if (title) {
      const newEvent = { id: generateId(), title, start: arg.dateStr };
      setEvents([...events, newEvent]);
    }
  };

  const handleEventClick = async (arg) => {
    const action = prompt('Edit (E) or Delete (D) event?');
    if (action && action.toUpperCase() === 'E') {
      const title = prompt('Edit event title:', arg.event.title);
      if (title) {
        const updatedEvents = events.map((event) =>
          event.id === arg.event.id ? { ...event, title } : event
        );
        setEvents(updatedEvents);
      }
    } else if (action && action.toUpperCase() === 'D') {
      const confirmed = window.confirm('Are you sure you want to delete this event?');
      if (confirmed) {
        try {
          await deleteDoc(doc(db, "users", auth.currentUser.uid, "events", arg.event.id));
          const filteredEvents = events.filter((event) => event.id !== arg.event.id);
          setEvents(filteredEvents);
        } catch (error) {
          console.error('Error deleting event:', error);
        }
      }
    }
  };

  const generateId = () => {
    return '_' + Math.random().toString(36).substr(2, 9);
  };

  const jumpToYear = () => {
    const year = prompt('Enter year:');
    if (year && !isNaN(year)) {
      calendarRef.current.getApi().gotoDate(`${year}-01-01`);
    } else {
      alert('Please enter a valid year.');
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 h-sm" style={{ overflow: 'auto' }}>
      <h2 className="text-2xl font-semibold mb-4">Calendar</h2>
      <button onClick={jumpToYear} className="mb-4">Jump to Year</button>
      <div style={{ height: `${calendarHeight}px`, width: '100%' }}>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
          initialView="dayGridMonth"
          weekends={true}
          events={events}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          selectable={true}
          editable={true}
          className="mt-4 "
        />
      </div>
    </div>
  );
};

export default Calendar;
