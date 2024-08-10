import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:6003/bookings', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText);
                }

                const data = await response.json();
                console.log('Fetched bookings:', data); // Add logging
                setBookings(data);
            } catch (error) {
                console.error('Error fetching bookings:', error.message);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    return (
        <>
            <h2>My Bookings</h2>
            <div style={{marginLeft:"20%"}}>
            <TableContainer component={Paper} >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Event Title</TableCell>
                            <TableCell>Booked By</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Booking Time</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4}>Loading...</TableCell>
                            </TableRow>
                        ) : error ? (
                            <TableRow>
                                <TableCell colSpan={4}>Error: {error}</TableCell>
                            </TableRow>
                        ) : bookings.length > 0 ? (
                            bookings.map(booking => (
                                <TableRow key={booking._id}>
                                    <TableCell>{booking.event.title}</TableCell>
                                    <TableCell>{booking.user.name}</TableCell>
                                    <TableCell>{booking.user.email}</TableCell>
                                    <TableCell>{new Date(booking.bookingTime).toLocaleString()}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4}>No bookings available.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            </div>
        </>
    );
};

export default Bookings;
