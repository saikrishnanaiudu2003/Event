import  { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './index.css'

const RegisterPage = () => {
    const [name, setName] = useState('');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user'); // Default to 'user'
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:6003/signup', { name,email, password, role });
            setSuccess('Registration successful! Redirecting to login...');
            // Redirect or show success message
            setError(''); // Clear any previous errors
        setTimeout(() => {
            navigate('/Login');
        }, 2000);
        } catch (error) {
            setError('Error registering user');
            setSuccess('');
            console.log(error)
        }
    };
    return (
        <div className="auth-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
            <div className="form-group">
                    <label>Name:</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Role:</label>
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="user">User</option>
                        <option value="organizer">Organizer</option>
                        
                    </select>
                </div>
                <button type="submit">Register</button>
                <Link style={{display:"flex",justifyContent:"center",marginTop:"10px"}} to="/login">Login</Link>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
            </form>
        </div>
    )
}

export default RegisterPage;