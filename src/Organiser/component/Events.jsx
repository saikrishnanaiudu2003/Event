import { useState, useEffect } from 'react';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [isOrganizer, setIsOrganizer] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: '',
        description: '',
        date: '',
        location: '',
        image: '',
        price: '',
        speaker: '',
        seats: '',
        contactNumber: ''
    });
    const [loading, setLoading] = useState(false);
    const [editEvent, setEditEvent] = useState(null); // For editing event

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('http://localhost:6003/events', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText);
                }

                const data = await response.json();
                setEvents(data);

            } catch (error) {
                console.error('Error fetching events:', error.message);
            }
        };

        fetchEvents();

        const userRole = localStorage.getItem('role');
        if (userRole === 'organizer') {
            setIsOrganizer(true);
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEvent({ ...newEvent, [name]: value });
    };

    const handleAddEvent = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
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
                contactNumber: ''
            });
            setShowPopup(false);
        } catch (error) {
            console.error('Error adding event:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditEvent = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:6003/events/${editEvent._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(editEvent)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const updatedEvent = await response.json();
            setEvents(events.map(event => event._id === updatedEvent._id ? updatedEvent : event));
            setEditEvent(null);
            setShowPopup(false);
        } catch (error) {
            console.error('Error editing event:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteEvent = async (eventId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:6003/events/${eventId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            setEvents(events.filter(event => event._id !== eventId));
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    return (
        <>
            <h2>Events</h2>
            <div style={{ marginLeft: "20%" }}>
                {isOrganizer && (
                    <button style={{width:"200px"}} onClick={() => setShowPopup(true)}>Add Event</button>
                )}

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
                                        <p>Contact Number: {event.contactNumber}</p>
                                        {isOrganizer && (
                                            <>
                                                <button style={{ width: "200px", marginBottom: "10px" }} onClick={() => {
                                                    setEditEvent(event);
                                                    setNewEvent(event);
                                                    setShowPopup(true);
                                                }}>Edit</button>
                                                <button style={{ width: "200px" }} onClick={() => handleDeleteEvent(event._id)}>Delete</button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No events available.</p>
                        )}
                    </div>
                </div>

                {/* Popup for Adding/Editing Event */}
                {showPopup && (
                    <div className='popup-overlay'>
                        <div className='popup-content'>
                            <h3>{editEvent ? 'Edit Event' : 'Add Event'}</h3>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                editEvent ? handleEditEvent() : handleAddEvent();
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
                                    Contact Number:
                                    <input type='text' name='contactNumber' value={newEvent.contactNumber} onChange={handleInputChange} required />
                                </label>
                                <button type='submit' disabled={loading}>{editEvent ? 'Save Changes' : 'Add Event'}</button>
                                <button type='button' onClick={() => setShowPopup(false)}>Cancel</button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Events;
