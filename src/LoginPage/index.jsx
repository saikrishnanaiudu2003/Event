import  { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:6003/login', { email, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('role', response.data.role);
            const role = response.data.role;
            console.log(response.data)

            // Redirect based on the user's role
            if (role === 'admin') {
                navigate('/admin');
            } else if (role === 'organizer') {
                navigate('/organizer');
            } else {
                navigate('/user');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Error logging in');
        }
    };
    return (
        <div className="auth-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
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
            <button type="submit">Login</button>
            <Link style={{display:"flex",justifyContent:"center",marginTop:"10px"}} to="/">Register</Link>
            {error && <p className="error">{error}</p>}
        </form>
    </div>
    )
}

export default LoginPage