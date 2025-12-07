import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');


        try {
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            navigate('/login');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

     return (
        <div className = "LoginPage">
            <div className = "LoginCard">
                <h1 className = "LoginTitle">Create Account</h1>
                <p className = "LoginSubtitle"> 
                    Already have an account? {' '} 
                    <Link to = "/login" className = "LoginLink">
                    Log In
                    </Link>
                </p>

                <form onSubmit = {handleSubmit} className = "LoginForm">
                    <div className = "LoginField">
                        <label className = "LoginLabel">Username</label>
                        <input
                            type = "text"
                            value = {username}
                            onChange = {(e) => setUsername(e.target.value)}
                            className = "LoginInput"
                            required
                        />
                    </div>


                    <div className = "LoginField">
                        <label className = "LoginLabel">Email</label>
                        <input
                            type = "email"
                            value = {email}
                            onChange = {(e) => setEmail(e.target.value)}
                            className = "LoginInput"
                            required
                        />
                    </div>

                    <div className = "LoginField">
                        <label className = "LoginLabel">Password</label>
                        <input
                            type = "password"
                            value = {password}
                            onChange = {(e) => setPassword(e.target.value)}
                            className = "LoginInput"
                            required
                        />
                    </div>

                    {error && <p className = "LoginError">{error}</p>}

                    <button type="submit" className="LoginButton" disabled={loading}>
                        {loading ? 'Creating account…' : 'Create account'}
                    </button>
                </form>
            </div>
        </div>
    );
}