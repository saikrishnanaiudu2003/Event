// src/components/Sidebar.jsx

import { Link,useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaUsers, FaChartLine,FaSignOutAlt } from 'react-icons/fa';
import './Sidebar.css'


const Sidebar = () => {

    const navigate = useNavigate(); // Hook to programmatically navigate

    const handleLogout = () => {
        // Remove JWT token from local storage
        localStorage.removeItem('token');

        // Optionally redirect to login page or home
        navigate('/login'); // Adjust the path as needed
    };

    return (
        <div className="sidebar">
            <h2>Admin Dashboard</h2>
            <ul>
                <li><Link to="/admin" active><FaCalendarAlt /> Events</Link></li>
                <li><Link to="/admin/users"><FaUsers /> Users</Link></li>
                <li><Link to="/admin/analytics"><FaChartLine />Bookings</Link></li>
               
                <li><button className="logout-button" onClick={handleLogout}><FaSignOutAlt /> Logout</button></li> {/* Logout button */}

            </ul>
            
        </div>
    );
};

export default Sidebar;
