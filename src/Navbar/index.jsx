// src/components/Navbar.jsx


import { Link ,useNavigate} from 'react-router-dom';
import './index.css'


const Navbar = () => {

    const navigate = useNavigate();

    const handleLogout = () => {
        // Remove the token from local storage
        localStorage.removeItem('token');

        // Redirect to the login page
        navigate('/login');
    };
    
    return (
        <nav className="navbar">
            <ul>
                <li><Link to="/user/events">Events</Link></li>
                <li><Link to="/user/bookings">My Bookings</Link></li>
                <li>
                    <Link to="/login" onClick={handleLogout}>Logout</Link>
                </li>
                
            </ul>
        </nav>
    );
};

export default Navbar;
