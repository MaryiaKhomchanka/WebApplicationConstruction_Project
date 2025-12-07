import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);


    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
            return;
        }


        const fetchProfile = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/me', {
                    headers: {
                        Authorization: `Bearer ${token}`, 
                    },
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Failed to fetch profile');
                }

                setUser(data.user);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);


    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');

        navigate('/');
        window.location.reload();
    };


    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return (
        <div className="container mt-4">
        <p className="text-danger">Error: {error}</p>
        <button className="btn btn-secondary" onClick={() => navigate('/login')}>
            Go to Login
        </button>
        </div>
        );
    }
    
    return (
    <div className="container mt-4">
      <h1>My Profile</h1>

      {user && (
        <div className="mt-3">
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          {/* later you can add more personal fields here */}
        </div>
      )}

      <button className="btn btn-danger mt-3" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}