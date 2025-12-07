import banner from '../assets/banner.png'
import aboutMe from '../assets/AboutMe.jpg'


export default function Home() {
  return (
    <div className="home">

        
      <div className="d-flex flex-column gap-5">
        <div className = "card m-0 homeBanner"> 
            <div className = "container-fluid text-center p-0">
                <img src={banner} className="img-fluid" alt="Banner image"/> 
            </div>
        </div>


         <div className = "card m-5 p-4"> 
            <div className = "row g-0">
            <div className = "col-md-4">
                <img src = {aboutMe} alt = "About Me" className = "circle-image img-fluid rounded-circle border border-3 border-primary"/> 
            </div>
            <div className = "col-md-8">
                <div className = "card-body text-center">
                    <h1 className = "card-title">About Me</h1>
                    <p className = "card-text ">Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                </div>
            </div>
            </div>
        </div>

        <div className = "card m-4"> 
        <div className = "card-body">
            <h1 className = "card-title text-center">Schedule</h1>
            <table className = "table table-bordered text-center mt-4">
                <thead>
                    <tr>
                        <th scope="col">Day</th>
                        <th scope="col">Time</th>
                        <th scope="col">Activity</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Monday</td>
                        <td>10:00 AM - 11:00 AM</td>
                        <td>Activity 1</td>
                    </tr>
                    <tr>
                        <td>Tuesday</td>
                        <td>2:00 PM - 3:00 PM</td>
                        <td>Activity 2</td>
                    </tr>
                    <tr>
                        <td>Wednesday</td>
                        <td>1:00 PM - 2:00 PM</td>
                        <td>Activity 3</td>
                    </tr>
                    <tr>
                        <td>Thursday</td>
                        <td>11:00 AM - 12:00 PM</td>
                        <td>Activity 4</td>
                    </tr>
                    <tr>
                        <td>Friday</td>
                        <td>3:00 PM - 4:00 PM</td>
                        <td>Activity 5</td>
                    </tr>
                </tbody>
            </table>
        </div>
        </div>
    </div>

    </div>
  )
}