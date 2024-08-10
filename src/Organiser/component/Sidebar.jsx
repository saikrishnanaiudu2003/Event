
import { Link,useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaChartLine,FaSignOutAlt } from 'react-icons/fa';
import './Sidebar.css'; // Make sure to create this CSS file

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
            <h2>Organizer Dashboard</h2>
            <ul>
                <li><Link to="/organizer/"> <FaCalendarAlt/> Events</Link></li>
                <li><Link to="/organizer/bookings"> <FaChartLine/> Bookings</Link></li>
                <li><button className="logout-button" onClick={handleLogout}><FaSignOutAlt /> Logout</button></li> {/* Logout button */}
            </ul>
        </div>
    );
};

export default Sidebar;
