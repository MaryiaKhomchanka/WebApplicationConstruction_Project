import banner from '../assets/banner.png'

export default function Contact() {
  return (

    <main className = "ContactPage">

      {/*Banner*/}

      <section className = "HomeSection p-0">
        <div className = "m-0 homeBanner"> 
          <div className = "container-fluid text-center p-0">
            <img src={banner} className="img-fluid" alt="Banner image"/> 
          </div>
        </div>
      </section>


      <section className="ContactSection container">
        <div className="row g-4 ContactCardGrid">
          {/*Discord*/}
          <div className="col-md-4">
            <div className="ContactCard text-center p-4">
             
              <h2 className="ContactItemTitle">Discord</h2>
              <p className="ContactItemText">Join the community!</p>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                className="ContactLink"
              >
                Join Discord
              </a>
            </div>
          </div>

          {/*Twitch*/}
          <div className="col-md-4">
            <div className="ContactCard text-center p-4">
             
              <h2 className="ContactItemTitle">Twitch</h2>
              <p className="ContactItemText">Watch the stream!</p>
              <a
                href="https://twitch.tv/purpleberryvtuber"
                target="_blank"
                rel="noreferrer"
                className="ContactLink"
              >
                Open Twitch
              </a>
            </div>
          </div>

          {/*YouTube*/}
          <div className="col-md-4">
            <div className="ContactCard text-center p-4">
             
              <h2 className="ContactItemTitle">YouTube</h2>
              <p className="ContactItemText">Watch the videos!</p>
              <a
                href="https://youtube.com/"
                target="_blank"
                rel="noreferrer"
                className="ContactLink"
              >
                Open YouTube
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}