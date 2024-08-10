import  { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ roles, children }) => {
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const response = await fetch('http://localhost:6003/verify', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setRole(data.role);
            } catch (error) {
                console.error('Error fetching user role:', error);
                // Optionally handle errors or redirect to login
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchUserRole();
        } else {
            setLoading(false);
        }
    }, [token]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!token) {
        return <Navigate to="/login" />;
    }

    if (role && !roles.includes(role)) {
        return <Navigate to="/unauthorized" />;
    }

    return children;
};

ProtectedRoute.propTypes = {
    roles: PropTypes.arrayOf(PropTypes.string).isRequired,
    children: PropTypes.node.isRequired
};

export default ProtectedRoute;
