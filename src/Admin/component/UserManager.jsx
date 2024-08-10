import  { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';

const UserManager = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [editForm, setEditForm] = useState({
        name: '',
        role: '',
        password: '' // Assuming you may still want to include password for updates
    });
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem('token');
            try {
                const result = await axios.get('http://localhost:6003/users', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                setUsers(result.data);
            } catch (error) {
                setError('Error fetching users');
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleEditClick = (user) => {
        setEditingUser(user);
        setEditForm({
            name: user.name,
            role: user.role,
            password: '' // Password is not pre-filled
        });
        setOpen(true); // Open the modal
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm({ ...editForm, [name]: value });
    };

    const handleEditSubmit = async () => {
        const token = localStorage.getItem('token');
        try {
            console.log('Sending request to:', `http://localhost:6003/users/${editingUser._id}`);
            console.log('Payload:', editForm);

            const response = await axios.put(`http://localhost:6003/users/${editingUser._id}`, {
                name: editForm.name,
                role: editForm.role,
                password: editForm.password ? editForm.password : undefined // Send password only if provided
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Response:', response);

            setUsers(users.map(user => (user._id === editingUser._id ? { ...user, ...editForm, password: editForm.password ? '*****' : user.password } : user)));
            setEditingUser(null);
            setEditForm({ name: '', role: '', password: '' });
            setOpen(false); // Close the modal
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleDeleteClick = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:6003/users/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setUsers(users.filter(user => user._id !== id));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
        <>
            <h2>User Manager</h2>
            <div style={{ marginLeft: "20%" }}>
                {loading && <p>Loading...</p>}
                {error && <p>{error}</p>}
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="user table">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow
                                    key={user._id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {user._id}
                                    </TableCell>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell>
                                        <Button style={{width:"100px",marginRight:"10px"}} variant="contained" color="primary" onClick={() => handleEditClick(user)}>Edit</Button>
                                        <Button style={{width:"100px"}} variant="contained" color="secondary" onClick={() => handleDeleteClick(user._id)}>Delete</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Dialog open={open} onClose={() => setOpen(false)}>
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Name"
                            name="name"
                            value={editForm.name}
                            onChange={handleEditChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Role"
                            name="role"
                            value={editForm.role}
                            onChange={handleEditChange}
                            fullWidth
                            margin="normal"
                        />
                      
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpen(false)} color="secondary">Cancel</Button>
                        <Button onClick={handleEditSubmit} color="primary">Save</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </>
    );
};

export default UserManager;
