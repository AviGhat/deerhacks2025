import Link from "next/link";

export default function MainPage() {
  return (
    <div className="MainPage">
<iframe
  className="background-video"
  src="https://player.vimeo.com/video/1057210802?background=1&autoplay=1&loop=1&muted=1"
  style={{ border: "none" }}
  allow="autoplay; fullscreen"
  allowFullScreen
></iframe>




      {/* Content on top of the video */}
      <div className="content">
        <div className="title1">
        <h1>DISCOVER ME</h1>
        </div>
        <div className="description">
        <p>Your personality. Your journey. Your perfect destination!</p>
        </div>
        <Link href="/personalitytest">
        <button className="explore-button">Start Personality Quiz</button>
        </Link>

      </div>

      <div className="footer-bar">
      <footer>
        Aviraj Ghatora, Haashir Khan
      </footer>
      </div>

    </div>

  );
}