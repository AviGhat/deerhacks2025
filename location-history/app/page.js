import Link from "next/link";

export default function MainPage() {
  return (
    <div className="MainPage">
      <video autoPlay loop muted playsInline className="background-video">
        <source src="/stockedit.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Content on top of the video */}
      <div className="content">
        <div className="title1">
        <h1>PERSONALITY PLACES</h1>
        </div>
        <div className="description">
        <p>Discover amazing places based on your personality!</p>
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