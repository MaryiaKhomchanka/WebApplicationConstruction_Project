import {useState} from 'react';
import {useNavigate, Link} from 'react-router-dom'; //Changing pages and linking to other pages


export default function Login() {
    const[emailOrUsername, setEmailOrUsername] = useState('');
    const[password, setPassword] = useState('');
    const[error, setError] = useState(''); //Text to show error messages
    const[loading, setLoading] = useState(false); //Loading = true when the request is being processed

    const navigate = useNavigate(); //Used to change pages

    const handleSubmit = async (e) => {
        e.preventDefault(); //Preventing the page from reloading after form submission
        setLoading(true);
        setError('');


        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({emailOrUsername, password}),
            }); //Calling the backend API

            const data = await response.json(); //Converting the response to JSON

            if(!response.ok){
                throw new Error(data.error || 'Login failed');
            }

            localStorage.setItem('token', data.token); //Storing the token in localStorage
            localStorage.setItem('username', data.user.username); //Storing the username in localStorage

            window.dispatchEvent(new Event("loginChange"));

            navigate('/profile');
           

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false); //No matter what happens, stop the loading state, so the button is clickable again
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