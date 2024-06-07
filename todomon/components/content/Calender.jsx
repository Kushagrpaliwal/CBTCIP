// components/Calender.js

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Script from 'next/script';
import { format, addHours } from 'date-fns';

const CLIENT_ID = "749403399063-rdehigpqs00adk16ihjbnrbpl1k22iar.apps.googleusercontent.com";
const API_KEY = "AIzaSyCLaIWEfhpnZVv9nUj57aNjNlhSnTHieao";
const DISCOVERY_DOC = "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";
const SCOPES = "https://www.googleapis.com/auth/calendar";
let tokenClient;
let gapiInited = false;
let gisInited = false;

const Calender = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    window.gapiLoaded = () => {
      gapi.load("client", initializeGapiClient);
    };

    window.gisLoaded = () => {
      tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: "", // defined later
      });
      gisInited = true;
    };

    const initializeGapiClient = async () => {
      await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
      });
      gapiInited = true;
    };

    const createGoogleEvent = (eventDetails) => {
      tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
          throw resp;
        }
        await scheduleEvent(eventDetails);
      };

      if (gapi.client.getToken() === null) {
        tokenClient.requestAccessToken({ prompt: "consent" });
      } else {
        tokenClient.requestAccessToken({ prompt: "" });
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

    // Fetch events when the component mounts
    fetchUpcomingEvents();
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
    <div className="card">
      <p id="title">Book Appointment</p>
      <form onSubmit={handleSubmit(scheduleMeeting)}>
        <div className="form-group">
          <label htmlFor="summary">Meeting Summary</label>
          <input
            type="text"
            id="summary"
            {...register("summary", { required: true })}
          />
          {errors.summary && <span>This field is required</span>}
        </div>
        <div className="form-group">
          <label htmlFor="appointmentTime">Meeting Time</label>
          <input
            type="datetime-local"
            id="appointmentTime"
            {...register("appointmentTime", { required: true })}
          />
          {errors.appointmentTime && <span>This field is required</span>}
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className="form-control"
            {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
          />
          {errors.email && <span>Please enter a valid email</span>}
        </div>
        <br />
        <button type="submit" id="schedule-button">Schedule Appointment</button>
      </form>
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
      <div>
        <h2>Upcoming Events</h2>
        <ul>
          {events.map((event) => (
            <li key={event.id}>
              <p>Summary: {event.summary}</p>
              <p>Start: {event.start.dateTime || event.start.date}</p>
              <p>End: {event.end.dateTime || event.end.date}</p>
              <button onClick={() => window.deleteEvent(event.id)}>Delete Event</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Calender;
