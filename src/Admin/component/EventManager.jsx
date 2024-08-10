import { useState, useEffect } from 'react';
import './index.css';

const EventManager = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [events, setEvents] = useState([]);
    const [newEvent, setNewEvent] = useState({
        title: '',
        description: '',
        date: '',
        location: '',
        image: '',
        price: '',
        speaker: '',
        seats: '',
        contactNumber: ''  // Added contactNumber to state
    });
    const [editingEvent, setEditingEvent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        users: 0,
        bookings: 0,
        events: 0
    });

    // Fetch events and stats from API
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token'); // Ensure token is retrieved
            try {
                // Fetch counts
                const userResponse = await fetch('http://localhost:6003/stats/users', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                const userData = await userResponse.json();

                const bookingResponse = await fetch('http://localhost:6003/stats/bookings', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                const bookingData = await bookingResponse.json();

                const eventResponse = await fetch('http://localhost:6003/stats/events', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                const eventData = await eventResponse.json();

                setStats({
                    users: userData.count,
                    bookings: bookingData.count,
                    events: eventData.count
                });

                // Fetch events
                const eventResponseAll = await fetch("http://localhost:6003/events", {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!eventResponseAll.ok) {
                    throw new Error(`HTTP error! Status: ${eventResponseAll.status}`);
                }

                const eventDataAll = await eventResponseAll.json();
                setEvents(eventDataAll);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEvent({ ...newEvent, [name]: value });
    };

    const handleAddEvent = async () => {
        setLoading(true);
        const token = localStorage.getItem('token'); // Ensure token is retrieved
        try {
            const response = await fetch("http://localhost:6003/events", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newEvent)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const addedEvent = await response.json();
            setEvents([...events, addedEvent]);
            setNewEvent({
                title: '',
                description: '',
                date: '',
                location: '',
                image: '',
                price: '',
                speaker: '',
                seats: '',
                contactNumber: '' // Reset contactNumber field
            });
            setShowPopup(false);
        } catch (error) {
            console.error('Error adding event:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditEvent = (event) => {
        setEditingEvent(event);
        setShowPopup(true);
        setNewEvent(event);
    };

    const handleUpdateEvent = async () => {
        setLoading(true);
        const token = localStorage.getItem('token'); // Ensure token is retrieved
        try {
            const response = await fetch(`http://localhost:6003/events/${editingEvent._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newEvent)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const updatedEvent = await response.json();
            setEvents(events.map(e => (e._id === updatedEvent._id ? updatedEvent : e)));
            setNewEvent({
                title: '',
                description: '',
                date: '',
                location: '',
                image: '',
                price: '',
                speaker: '',
                seats: '',
                contactNumber: '' // Reset contactNumber field
            });
            setEditingEvent(null);
            setShowPopup(false);
        } catch (error) {
            console.error('Error updating event:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteEvent = async (id) => {
        const token = localStorage.getItem('token'); // Ensure token is retrieved
        try {
            const response = await fetch(`http://localhost:6003/events/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            setEvents(events.filter(event => event._id !== id));
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    return (
        <>
            <h2>Events</h2>
            <div style={{ marginLeft: "20%" }}>
                <div className='stats'>
                    <p>Registered Users: {stats.users}</p>
                    <p>Bookings: {stats.bookings}</p>
                    <p>Events: {stats.events}</p>
                </div>
                
                <div>
                    <div>
                        <button className='add-event-button' onClick={() => setShowPopup(true)}>
                            {editingEvent ? 'Update Event' : 'Add Event'}
                        </button>
                    </div>

                    {/* Popup for Adding/Editing Event */}
                    {showPopup && (
                        <div className='popup-overlay'>
                            <div className='popup-content'>
                                <h3>{editingEvent ? 'Edit Event' : 'Add Event'}</h3>
                                <form className='ad' onSubmit={(e) => {
                                    e.preventDefault();
                                    editingEvent ? handleUpdateEvent() : handleAddEvent();
                                }}>
                                    <label>
                                        Title:
                                        <input type='text' name='title' value={newEvent.title} onChange={handleInputChange} required />
                                    </label>
                                    <label>
                                        Description:
                                        <textarea name='description' value={newEvent.description} onChange={handleInputChange} required />
                                    </label>
                                    <label>
                                        Date:
                                        <input type='datetime-local' name='date' value={newEvent.date} onChange={handleInputChange} required />
                                    </label>
                                    <label>
                                        Location:
                                        <input type='text' name='location' value={newEvent.location} onChange={handleInputChange} />
                                    </label>
                                    <label>
                                        Image URL:
                                        <input type='text' name='image' value={newEvent.image} onChange={handleInputChange} />
                                    </label>
                                    <label>
                                        Price:
                                        <input type='number' name='price' value={newEvent.price} onChange={handleInputChange} />
                                    </label>
                                    <label>
                                        Speaker:
                                        <input type='text' name='speaker' value={newEvent.speaker} onChange={handleInputChange} />
                                    </label>
                                    <label>
                                        Seats:
                                        <input type='number' name='seats' value={newEvent.seats} onChange={handleInputChange} />
                                    </label>
                                    <label>
                                        Contact Number: {/* New field for Contact Number */}
                                        <input type='text' name='contactNumber' value={newEvent.contactNumber} onChange={handleInputChange} required />
                                    </label>
                                    <button type='submit' disabled={loading}>{editingEvent ? 'Update Event' : 'Add Event'}</button>
                                    <button type='button' onClick={() => setShowPopup(false)}>Cancel</button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Display Events */}
                    <div className='main-events-flex-card'>
                        <div className='events-list'>
                            {events.length > 0 ? (
                                events.map((event) => (
                                    <div key={event._id} className='event-item'>
                                        <img src={event.image} alt={event.title} className='event-image' />
                                        <div>
                                            <h3>{event.title}</h3>
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
                                            <p>Contact Number: {event.contactNumber}</p> {/* Display Contact Number */}
                                            <button style={{width:"200px",marginBottom:"10px"}} onClick={() => handleEditEvent(event)}>Edit</button>
                                            <button style={{width:"200px"}} onClick={() => handleDeleteEvent(event._id)}>Delete</button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No events available.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EventManager;
