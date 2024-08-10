import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './index.css'; // Ensure you have appropriate styles for this component

const EventDetail = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [booked, setBooked] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch the event details by ID
        const fetchEvent = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token provided');
                setError('No token provided');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://localhost:6003/events/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Error fetching event:', errorText);
                    setError(`Error fetching event: ${errorText}`);
                    setLoading(false);
                    return;
                }

                const data = await response.json();
                setEvent(data);
            } catch (error) {
                console.error('Error fetching event:', error);
                setError(`Error fetching event: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    const handleBooking = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token provided');
            setError('No token provided');
            return;
        }

        try {
            const response = await fetch('http://localhost:6003/bookings', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ eventId: id }) // Send only the event ID
            });

            if (!response.ok) {
                const errorData = await response.json(); // Parse JSON error response
                console.error('Error booking event:', errorData.message || 'Unknown error');
                setError(`Error booking event: ${errorData.message || 'Unknown error'}`);
                return;
            }

            const data = await response.json();
            console.log('Booking successful:', data); // Debug response
            setBooked(true); // Set booking status based on the response
        } catch (error) {
            console.error('Error booking event:', error.message || 'Unknown error');
            setError(`Error booking event: ${error.message || 'Unknown error'}`);
        }
    };

    if (loading) return <p>Loading...</p>;

    if (error) return <p>{error}</p>;

    if (!event) return <p>Event not found.</p>;

    return (
        <div className="event-detail">
            {event.image ? (
                <img src={event.image} alt={event.title} className="event-image" />
            ) : (
                <div className="event-image-placeholder">No Image Available</div>
            )}
            <h2>{event.title}</h2>
            <p>{event.description}</p>
            <p>Date: {new Date(event.date).toLocaleString('en-US', {
    weekday: 'long', // Full name of the day (e.g., Monday)
    year: 'numeric', // Full year (e.g., 2024)
    month: 'long', // Full month name (e.g., August)
    day: 'numeric', // Day of the month (e.g., 9)
    hour: 'numeric', // Hour (e.g., 1 PM)
    minute: 'numeric', // Minute (e.g., 45)
    second: 'numeric', // Second (e.g., 30)
    hour12: true, // Use 12-hour format
})}</p>
            <p>Location: {event.location}</p>
            <p>Price: INR {event.price}</p>
            <p>Speaker: {event.speaker}</p>
            <p>Seats: {event.seats}</p>
            {booked ? (
                <p>Booked!</p>
            ) : (
                <button onClick={handleBooking}>Book Now</button>
            )}
        </div>
    );
};

export default EventDetail;
