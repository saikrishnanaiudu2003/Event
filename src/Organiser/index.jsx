
import { Routes, Route } from 'react-router-dom';
import Sidebar from './component/Sidebar';
import Events from './component/Events';
import Bookings from './component/Bookings.jsx';

const Organiser = () => {
    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <div className='content' style={{ flexGrow: 1, padding: '1rem' }}>
                <Routes>
                    <Route path="/" element={<Events />} />
                    <Route path="bookings" element={<Bookings />} />
                </Routes>
            </div>
        </div>
    );
};

export default Organiser;
