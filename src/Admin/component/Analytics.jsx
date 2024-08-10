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

const Analytics = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch('http://localhost:6003/bookings', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                console.log('Fetched bookings:', data); // Debug data
                setBookings(data);
            } catch (error) {
                setError('Error fetching bookings');
                console.error('Error fetching bookings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString || typeof dateString !== 'string') return 'No date provided';

        const date = new Date(dateString);

        if (isNaN(date.getTime())) return 'Invalid Date';

        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    };

    return (
        <div style={{ marginLeft: "20%" }}>
            <Container component={Paper} elevation={3} style={{ padding: '2rem', marginTop: '2rem' }}>
                <Typography variant="h4" gutterBottom>Analytics</Typography>
                {loading ? (
                    <CircularProgress />
                ) : error ? (
                    <Alert severity="error">{error}</Alert>
                ) : (
                    <div>
                        <Typography variant="h6" gutterBottom>Bookings</Typography>
                        {bookings.length > 0 ? (
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Event Title</TableCell>
                                            <TableCell>User</TableCell>
                                            <TableCell>Email</TableCell>
                                            <TableCell>Booking Date</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {bookings.map((booking) => (
                                            <TableRow key={booking._id}>
                                                <TableCell>{booking.event?.title || 'Unknown Event'}</TableCell>
                                                <TableCell>{booking.user?.name || 'Unknown User'}</TableCell>
                                                <TableCell>{booking.user?.email || 'No Email'}</TableCell>
                                                <TableCell>{formatDate(booking.bookingTime)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Typography variant="body1">No bookings available.</Typography>
                        )}
                    </div>
                )}
            </Container>
        </div>
    );
};

export default Analytics;
