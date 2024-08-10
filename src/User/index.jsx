// src/pages/UserPage.jsx


import Navbar from '../Navbar';
import EventList from '../EventList';
import EventDetail from '../EventDetail';
import { Routes, Route } from 'react-router-dom';
import Booking from '../Bookings';


const UserPage = () => {
    return (
        <div>
            <Navbar />
            <Routes>
                <Route path="/" element={<EventList />} /> {/* Default route for the user */}
                <Route path="events" element={<EventList />} />
                <Route path="events/:id" element={<EventDetail />} />
                <Route path='bookings' element={<Booking/>}/>
                {/* Add routes for bookings and profile as needed */}
            </Routes>
        </div>
    );
};

export default UserPage;
