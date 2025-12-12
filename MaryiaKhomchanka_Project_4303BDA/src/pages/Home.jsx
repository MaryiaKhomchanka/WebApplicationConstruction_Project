import{useEffect, useState} from 'react';
import{useNavigate} from 'react-router-dom';

import banner from '../assets/banner.png'
import aboutMe from '../assets/AboutMe.jpg'


export default function Home() {
    const[currentStream, setCurrentStream] = useState(null);
    const[streamLoading, setStreamLoading] = useState(true);
    const[streamError, setStreamError] = useState('');

    const [schedule, setSchedule] = useState([]);
    const [scheduleLoading, setScheduleLoading] = useState(true);
    const [scheduleError, setScheduleError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if(!token) {
            setStreamLoading(false);
            return;
        }

        const load = async () => {
            try {
                setStreamLoading(true);
                setStreamError('');
                const res = await fetch('http://localhost:5000/api/stream/current', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();
                if(!res.ok) throw new Error(data.error || 'Failed to load stream info');

                setCurrentStream(data);
            } catch(error){
                console.error(error);
                setStreamError(error.message);
            }finally{
                setStreamLoading(false);
            }
        };

        load();

        const interval = setInterval(load, 20000); //Refreshes every 20 secs
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
    const loadSchedule = async () => {
      try {
        setScheduleLoading(true);
        setScheduleError('');
        const res = await fetch('http://localhost:5000/api/schedule'); //Calling the backend API
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load schedule');

        setSchedule(data); 
      } catch (error) {
        console.error(error);
        setScheduleError(error.message);
      } finally {
        setScheduleLoading(false);
      }
    };

        loadSchedule();
    }, []);

    const handleMarkWatched = async () => {
        const token = localStorage.getItem('token');
        if(!token) {
            navigate('/login');
            return;
        }

        try { 
            setStreamError('');
            const res = await fetch('http://localhost:5000/api/stream/watched',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to mark stream as watched');

            setCurrentStream(prev => prev ? { ...prev, watched: true } : prev); //Copies the stream state and updates the "watched" property
        } catch(error){
            console.error(error);
            setStreamError(error.message);
        }
    };



  return (
    <main className="HomePage">

{/*Home Banner*/}
        <section className = "HomeSection p-0">
            <div className = "m-0 homeBanner"> 
                <div className = "container-fluid text-center p-0">
                    <img src={banner} className="img-fluid" alt="Banner image"/> 
                </div>
            </div>
        </section>
        


{/*About me*/}
        <section className = "HomeSection container mb-5" id = "About">
            <div className = "card p-4 CustomCard w-100"> 
                <div className = "row g-0">
                    <div className = "col-md-4">
                        <img src = {aboutMe} alt = "About Me" className = "CircleImage img-fluid rounded-circle border border-3 HomeImageBorder"/> 
                    </div>
                    <div className = "col-md-8">
                        <div className = "card-body text-center">
                            <h1 className = "card-title">About Me</h1>
                            <p className = "card-text ">Hello, cutie! My name is Purple Berry, and I'm a vtuber!
                                Feel free to join my streams where we can play games, chat, and have a great time together!
                                We can also share a piece of cake while watching anime or just hanging out. But remember, the cake is a lie! :D
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        

{/*Schedule*/}
        <section className = "HomeSection container mb-5" id = "schedule">
            <div className = "card p-4 CustomCard w-100"> 
                <div className = "card-body">
                    <h1 className = "card-title text-center">Schedule</h1>

                    {scheduleError && (
                        <p className = "text-danger text-center mt-3">{scheduleError}</p>
                    )}


                    <table className = "table table-bordered text-center mt-4">
                        <thead>
                            <tr>
                                <th scope="col">Day</th>
                                <th scope="col">Time</th>
                                <th scope="col">Activity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {scheduleLoading ? (
                                <tr>
                                    <td colSpan = "3">Loading schedule...</td>
                                </tr>
                            ): schedule.length === 0? (
                                <tr>
                                    <td colSpan = "3">No schedule set yet.</td>
                                </tr>
                            ):(
                                schedule.map((item) => (
                                    <tr key = {item.id}>
                                        <td>{item.dayOfWeek}</td>
                                        <td>{item.startTime} - {item.endTime}</td>
                                        <td>{item.game}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
                           


{/*Twitch Player*/}

        <section className = "HomeSection container mb-5" id = "Player">
            <div className = "card p-4 CustomCard w-100">
                <h2 className = "mb-3 text-center TwitchTitle">Live on Twitch</h2>
                <p className = "text-center TwitchSubtitle" >Join the stream! I am waiting for you!</p>
                <div className = "TwitchPlayerWrapper">
                    <iframe 
                        src="https://player.twitch.tv/?channel=purpleberryvtuber&parent=localhost&muted=true"
                        height="480"
                        width="854"
                        allowFullScreen
                    ></iframe>
                </div>
            </div>

            {currentStream && currentStream.online && (
                    <section className = "container my-4">
                        <div className = "card p-4 text-center StreamWatchCard">
                            <h3 className = "mb-2">Watching the stream?</h3>
                            <p className = "mb-3">
                                Click the button once per stream to mark it as watched!
                            </p>

                            {currentStream.watched ? (
                                <p className = "text-success mb-0">
                                    You have already marked this stream as watched
                                </p>
                            ):(
                                <div className="StreamWatchBtnWrapper">
                                    <button className = "StreamWatchButton"
                                            onClick = {handleMarkWatched}
                                            disabled = {streamLoading}
                                    >
                                        {streamLoading ? 'Please wait…' : 'Mark this stream as watched'}
                                    </button>
                                </div>
                            )}
                            {streamError && (
                                <p className="text-danger mt-2">{streamError}</p>
                            )}
                        </div>
                    </section>
                )}
        </section>

    </main>
  )
}