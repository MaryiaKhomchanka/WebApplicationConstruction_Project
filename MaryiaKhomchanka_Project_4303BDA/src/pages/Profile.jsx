import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DefaultAvatar = "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png" //An avatar placeholder image

export default function Profile() {
    const [user, setUser] = useState(null); //Storing the current user info


    const [pageError, setPageError] = useState(''); //The whole page error
    const [loading, setLoading] = useState(true);

    const [email, setEmail] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [savingProfile, setSavingProfile] = useState(false);
    const [profileError, setProfileError] = useState(''); //Errors related to updating profile info


    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const [passwordError, setPasswordError] = useState('');


    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token'); //Reading the token from local storage

        if (!token) {
            navigate('/login'); //Redirecting to login if no token found
            return;
        }


        const fetchProfile = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/me', {
                    headers: {
                        Authorization: `Bearer ${token}`, //Authorization using the token
                    },
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to fetch profile');
                }

                setUser(data.user);
                setEmail(data.user.email || '');
                setAvatarUrl(data.user.avatarUrl || '');
            } catch (err) {
                setPageError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);


    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        window.dispatchEvent(new Event("loginChange")); //Changing login status to update the navbar
        navigate('/login');

    };

    const handleSaveProfile = async(e) => {
        e.preventDefault(); //Preventing page reload
        setSavingProfile(true); //Showing loading state
        setProfileError('');
        try{
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:5000/api/me",{
                method: "PUT",
                headers:{
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({email, avatarUrl}),
            });

            const data = await response.json();
            if(!response.ok){
                throw new Error(data.error || "Failed to update profile");
            }

            setUser(data.user);
        } catch(error){
            setProfileError(error.message);
        }finally {
            setSavingProfile(false);
        }
    };

    const handleChangePassword = async(e) => {
        e.preventDefault();
        setPasswordMessage("");
        setPasswordError("");

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:5000/api/me/password", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ currentPassword, newPassword}),
            });

            const data = await response.json();

            if(!response.ok){
                throw new Error(data.error || "Failed to change password");
            }
            setPasswordMessage("Password updated successfully");
            setCurrentPassword("");
            setNewPassword("");
        } catch(error){
            setPasswordError(error.message);
        }
    };


    if (loading) {
        return <div className = "ProfilePage d-flex justify-content-center align-items-center">Loading...</div>;
    } //Showing loading state

    if (pageError) {
    return (
      <div className="ProfilePage d-flex justify-content-center align-items-center">
        <div className="ProfileCard">
          <p className="text-danger mb-3">Error: {pageError}</p>
          <button className="btn btn-primary" onClick={() => navigate("/login")}>
            Go to Login
          </button>
        </div>
      </div>
    );
  } //Page-level error display
    
    return (

        <main className = "ProfilePage">
            <div className = "ProfileCard">
                {user && (
                    <>
                        {/*Avatar and name*/}
                        <div className = "ProfileHeader text-center">
                            <img src = {avatarUrl || DefaultAvatar} alt = "User avatar" className = "ProfileAvatar mb-3"/>
                            <h1 className ="ProfileTitle"> Howdy, {user.username}!</h1>
                            <p className = "ProfileSubtitle">Feel yourself at home!</p>
                        </div>

                        {/*Account info*/}
                        <section className = "ProfileSection mt-4">
                            <h2 className = "ProfileSectionTitle"> Account details</h2>
                            <form className = "ProfileForm" onSubmit = {handleSaveProfile}>
                                <div className = "ProfileField">
                                    <label className = "ProfileLabel">Email</label>
                                    <input type = "email" 
                                            className = "ProfileInput" 
                                            value = {email} onChange = {(e) => setEmail(e.target.value)}
                                            required />
                                </div>
                                
                                <div className = "ProfileField">
                                    <label className = "ProfileLabel">Avatar URL</label>
                                    <input type = "url"
                                            className = "ProfileInput"
                                            placeholder = "Paste a link to an image"
                                            value = {avatarUrl}
                                            onChange = {(e) => setAvatarUrl(e.target.value)}
                                    />         
                                </div>

                                {profileError && (
                                    <p className="text-danger mb-2">{profileError}</p>
                                )}

                                <button type = "submit" className = "ProfileButton" disabled = {savingProfile}>
                                    {savingProfile ? "Saving..." : "Save changes"}
                                </button>
                            </form>

                            <div className = "mt-3">
                                <p className = "ProfileLabel">
                                    Streams watched: {' '}
                                    <strong>{user.streamsWatched ?? 0}</strong>
                                </p>
                            </div>
                        </section>


                        <section className = "ProfileSection mt-4">
                            <h2 className = "ProfileSectionTitle">Change Password</h2>
                            <form className = "ProfileForm" onSubmit = {handleChangePassword}>
                                <div className = "ProfileField">
                                    <label className = "ProfileLabel">Current Password</label>
                                    <input type = "password" 
                                            className = "ProfileInput"
                                            value = {currentPassword}
                                            onChange = {(e) => setCurrentPassword(e.target.value)}
                                            required 
                                    />
                                </div>

                                <div className = "ProfileField">
                                    <label className = "ProfileLabel">New Password</label>
                                    <input type = "password"
                                            className = "ProfileInput"
                                            value = {newPassword}
                                            onChange = {(e) => setNewPassword(e.target.value)}
                                            required
                                    />
                                </div>

                                {passwordError && (
                                    <p className = "text-danger mb-2">{passwordError}</p>
                                )}

                                {passwordMessage && (
                                    <p className = "text-success mb-2">{passwordMessage}</p>
                                )}

                                <button type = "submit" className = "ProfileButtonSecondary">
                                    Update Password
                                </button>
                            </form>
                        </section>



                        {/*Log Out*/}

                        <div className = "ProfileFooter mt-4">
                            <button className = "btn btn-outline-danger" onClick = {handleLogout}>
                                Log Out
                            </button>
                        </div>
                    </>
                )}
            </div>
        </main>
  );
}