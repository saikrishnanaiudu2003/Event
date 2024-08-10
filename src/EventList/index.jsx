import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './index.css'; // Ensure your CSS handles the styling

const EventList = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [searchName, setSearchName] = useState('');
    const [searchLocation, setSearchLocation] = useState('');

    useEffect(() => {
        const fetchEvents = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token provided');
                return;
            }

            try {
                const response = await fetch('http://localhost:6003/events', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Error fetching events:', errorText);
                    return;
                }

                const data = await response.json();
                setEvents(data);
                setFilteredEvents(data);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchEvents();
    }, []);

    useEffect(() => {
        const filterEvents = () => {
            let filtered = events;

            if (searchName) {
                filtered = filtered.filter(event =>
                    event.title.toLowerCase().includes(searchName.toLowerCase())
                );
            }

            if (searchLocation) {
                filtered = filtered.filter(event =>
                    event.location && event.location.toLowerCase().includes(searchLocation.toLowerCase())
                );
            }

            setFilteredEvents(filtered);
        };

        filterEvents();
    }, [searchName, searchLocation, events]);

    return (
        <>
        <div style={{marginTop:"30px",marginLeft:"20px"}} className="search-filters">
                <input
                    type="text"
                    placeholder="Search by Event"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Search by location"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                />
            </div>
        <div className="event-list">
            
            {filteredEvents.map(event => (
                <div key={event._id} className="event-card">
                    {event.image ? (
                        <img src={event.image} alt={event.title} className="event-image" />
                    ) : (
                        <div className="event-image-placeholder">No Image Available</div>
                    )}
                    <h3>{event.title}</h3>
                    <p>{event.description}</p>
                    <Link to={`/user/events/${event._id}`}>Go to Event</Link>
                </div>
            ))}
        </div>
        </>
    );
};

export default EventList;
