import { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

const Booking = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    //sajdi

    useEffect(() => {
        const fetchBookings = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No token provided');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('http://localhost:6003/bookings', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    setError('Error fetching bookings: ' + errorText);
                    setLoading(false);
                    return;
                }

                const data = await response.json();
                setBookings(data);
            } catch (error) {
                setError('Error fetching bookings: ' + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;
    if (bookings.length === 0) return <Typography variant="body1">No bookings found.</Typography>;

    return (
        <Container component={Paper} elevation={3} style={{ padding: '2rem', marginTop: '2rem' }}>
            <Typography variant="h4" gutterBottom>Your Bookings</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Event</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Time</TableCell>
                            <TableCell>Booked By</TableCell>
                            <TableCell>Email</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
    {bookings.map(booking => (
        <TableRow key={booking._id}>
            <TableCell>{booking.event ? booking.event.title : 'Event Deleted'}</TableCell>
            <TableCell>{new Date(booking.bookingTime).toLocaleDateString()}</TableCell>
            <TableCell>{new Date(booking.bookingTime).toLocaleTimeString()}</TableCell>
            <TableCell>{booking.user ? booking.user.name : 'Unknown User'}</TableCell>
            <TableCell>{booking.user ? booking.user.email : 'Unknown Email'}</TableCell>
        </TableRow>
    ))}
</TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default Booking;
