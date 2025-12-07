import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function Login() {
    const[emailOrUsername, setEmailOrUsername] = useState('');
    const[password, setPassword] = useState('');
    const[error, setError] = useState('');
    const[loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');


        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ emailOrUsername, password }),
            });

            const data = await response.json();

            if(!response.ok){
                throw new Error(data.error || 'Login failed');
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.user.username);

            navigate('/profile');
            window.location.reload();

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className = "LoginPage">
            <div className = "LoginCard">
                <h1 className = "LoginTitle">Log In</h1>
                <p className = "LoginSubtitle"> 
                    Do not have an account yet? {' '} 
                    <Link to = "/register" className = "LoginLink">
                    Sign Up
                    </Link>
                </p>

                <form onSubmit = {handleSubmit} className = "LoginForm">
                    <div className = "LoginField">
                        <label className = "LoginLabel">Email or Username</label>
                        <input
                            type = "text"
                            value = {emailOrUsername}
                            onChange = {(e) => setEmailOrUsername(e.target.value)}
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

                    <button type = "submit" className = "LoginButton" disabled = {loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}