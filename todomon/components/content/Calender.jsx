import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Script from 'next/script';
import { format, addHours } from 'date-fns';

const CLIENT_ID = "749403399063-rdehigpqs00adk16ihjbnrbpl1k22iar.apps.googleusercontent.com";
const API_KEY = process.env.api;
const DISCOVERY_DOC = "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";
const SCOPES = "https://www.googleapis.com/auth/calendar";
let tokenClient;
let gapiInited = false;
let gisInited = false;

const Calendar = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [events, setEvents] = useState([]);
  const [token, setToken] = useState(null);

  useEffect(() => {
    window.gapiLoaded = () => {
      gapi.load("client", initializeGapiClient);
    };

    window.gisLoaded = () => {
      tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (tokenResponse) => {
          if (tokenResponse.error !== undefined) {
            throw tokenResponse;
          }
          setToken(tokenResponse.access_token);
        },
      });
      gisInited = true;
    };

    const initializeGapiClient = async () => {
      await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
      });
      gapiInited = true;
      fetchUpcomingEvents();
    };

    const createGoogleEvent = (eventDetails) => {
      if (!gapiInited || !gisInited) return;

      const callback = async (resp) => {
        if (resp.error !== undefined) {
          throw resp;
        }
        setToken(gapi.client.getToken());
        await scheduleEvent(eventDetails);
      };

      if (gapi.client.getToken() === null) {
        tokenClient.callback = callback;
        tokenClient.requestAccessToken({ prompt: "consent" });
      } else {
        callback({}); // Empty response signifies the token is already set
      }
    };

    const scheduleEvent = async (eventDetails) => {
      const event = {
        summary: eventDetails.summary,
        location: "Online",
        description: "Scheduled via the appointment scheduler.",
        start: {
          dateTime: eventDetails.startTime,
          timeZone: "America/Los_Angeles",
        },
        end: {
          dateTime: eventDetails.endTime,
          timeZone: "America/Los_Angeles",
        },
        attendees: [{ email: eventDetails.email }],
        reminders: {
          useDefault: false,
          overrides: [
            { method: "email", minutes: 24 * 60 },
            { method: "popup", minutes: 10 },
          ],
        },
      };
      const request = gapi.client.calendar.events.insert({
        calendarId: "primary",
        resource: event,
      });
      request.execute((event) => {
        console.info("Event created: " + event.htmlLink);
        fetchUpcomingEvents();
      });
    };

    const fetchUpcomingEvents = async () => {
      if (!gapiInited || !gisInited) return;

      if (gapi.client.getToken() === null) {
        tokenClient.requestAccessToken({ prompt: "consent" });
      } else {
        const response = await gapi.client.calendar.events.list({
          calendarId: 'primary',
          timeMin: (new Date()).toISOString(),
          showDeleted: false,
          singleEvents: true,
          maxResults: 10,
          orderBy: 'startTime',
        });

        const events = response.result.items;
        setEvents(events);
      }
    };

    const deleteEvent = async (eventId) => {
      const request = gapi.client.calendar.events.delete({
        calendarId: 'primary',
        eventId: eventId,
      });
      request.execute(() => {
        console.info("Event deleted");
        fetchUpcomingEvents();
      });
    };

    window.createGoogleEvent = createGoogleEvent;
    window.fetchUpcomingEvents = fetchUpcomingEvents;
    window.deleteEvent = deleteEvent;

    // Initialize the Google API client and fetch events
    if (gapiInited) {
      fetchUpcomingEvents();
    }
  }, []);

  const scheduleMeeting = (data) => {
    const appointmentTime = new Date(data.appointmentTime);
    const startTime = format(appointmentTime, "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone: 'America/Los_Angeles' });
    const endTime = format(addHours(appointmentTime, 1), "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone: 'America/Los_Angeles' });

    const eventDetails = {
      summary: data.summary,
      email: data.email,
      startTime: startTime,
      endTime: endTime,
    };

    console.info(eventDetails);
    window.createGoogleEvent(eventDetails);
  };

  return (
    <div className="ml-[50px] card">
      <p className='font-bold text-3xl mb-[20px]'>Events</p>
      <p className='font-light'>Here you can add events directly to your google calendar and can delete the events too .</p>
      <div className='mt-[35px] p-8 h-auto w-[85%] border border-gray-300 rounded-xl mb-[35px]'>
      <form onSubmit={handleSubmit(scheduleMeeting)}>
        <div className="form-group">
          <input
            type="text"
            id="summary"
            placeholder='Subject'
            className='border-none focus:outline-none w-full  resize-none overflow-hidden mb-2'
            {...register("summary", { required: true })}
          />
          {errors.summary && <span className='italic font-light'>This field is required</span>}
        </div>
        <div className="form-group">
          <input
            type="email"
            id="email"
            placeholder='Email'
            className='form-control border-none focus:outline-none w-full  resize-none overflow-hidden mb-2'
            {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
          />
          {errors.email && <span className='italic font-light'>Please enter a valid email</span>}
        </div>
        <hr className="border-gray-300 mb-3 " />
        <div className="form-group">
          <label htmlFor="appointmentTime" className='font-light'>Event Date & Time -:</label>
          <input
            type="datetime-local"
            id="appointmentTime"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm font-light focus:outline-none focus:border-green1"
            {...register("appointmentTime", { required: true })}
          />
          {errors.appointmentTime && <span className='italic font-light'>This field is required</span>}
        </div>
        <br />
        <button 
          type="submit" 
          id="schedule-button" 
          className='rounded-lg p-2 mr-2 bg-green1 drop-shadow-md hover:drop-shadow-xl text-white'>Schedule Appointment</button>
      </form>
      </div>
      <Script
        src="https://apis.google.com/js/api.js"
        strategy="afterInteractive"
        onLoad={() => window.gapiLoaded()}
      />
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => window.gisLoaded()}
      />
      <div className='p-5 font-light'>
        <h2 className='font-bold text-lg mb-5 '>Upcoming Events</h2>
        <ul>
          {events.map((event) => (
            <li key={event.id}>
              <p>Subject: {event.summary}</p>
              <p>Start: {event.start.dateTime || event.start.date}</p>
              <p>End: {event.end.dateTime || event.end.date}</p>
              <button 
                onClick={() => window.deleteEvent(event.id)}  
                className='rounded-lg p-2 mr-2 bg-green1 drop-shadow-md hover:drop-shadow-xl text-white mt-3 mb-3'>Delete Event</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Calendar;
