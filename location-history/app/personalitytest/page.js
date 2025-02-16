'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import "./MBTITest.css"; // Import external CSS file

// Define the quiz questions with a key to determine personality traits
const questions = [
  { key: "E-I", question: "I enjoy social gatherings more than spending time alone." },
  { key: "S-N", question: "I trust facts and past experiences over abstract theories." },
  { key: "T-F", question: "I prefer making decisions based on logic rather than emotions." },
  { key: "J-P", question: "I like to plan things out rather than be spontaneous." },
  { key: "E-I", question: "I feel energized after being around people for long periods of time." },
  { key: "S-N", question: "I focus more on the details rather than the bigger picture." },
  { key: "T-F", question: "I believe rules should be followed consistently rather than adjusted based on circumstances." },
  { key: "J-P", question: "I prefer having a set routine rather than going with the flow." }
];

export default function MBTITest() {
  const [answers, setAnswers] = useState({ E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 });
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [result, setResult] = useState("See your Results!");
  const [isTransitioning, setIsTransitioning] = useState(false); // State to handle transition
  const router = useRouter();

  const handleAnswer = (value) => {
    setIsTransitioning(true); // Start transition
    const key = questions[step].key;
    setAnswers((prev) => ({
      ...prev,
      [key[0]]: prev[key[0]] + value,
      [key[2]]: prev[key[2]] + (10 - value)
    }));

    setTimeout(() => {
      if (step < questions.length - 1) {
        setStep(step + 1);
      } else {
        setCompleted(true);
      }
      setIsTransitioning(false); // End transition
    }, 300); // Match the duration of the CSS transition
  };

  const calculateResult = () => {
    let mbti = "";
    mbti += answers["E"] >= answers["I"] ? "E" : "I";
    mbti += answers["S"] >= answers["N"] ? "S" : "N";
    mbti += answers["T"] >= answers["F"] ? "T" : "F";
    mbti += answers["J"] >= answers["P"] ? "J" : "P";
    setResult("Loading...");
    router.push(`/explore/${mbti}`);
  };

  return (
    <div className="container">
      <h2 className="MBTI-Title animate-fade-in">MBTI Personality Test!</h2>
      {completed ? (
        <div className="quiz-box animate-slide-up">
          <div className="result-section">
            <button className="result-button animate-pulse" onClick={calculateResult}>
              {result}
            </button>
          </div>
        </div>
      ) : (
        <div className="quiz-box animate-slide-up">
          <div className="question-section">
            <h2 className={`question-text ${isTransitioning ? "fade-out" : "fade-in"}`}>
              {questions[step].question}
            </h2>
            <div className="scale-container">
              <div className="scale-options">
                <span className="scale-label">Disagree</span>
                {["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"].map((option, index) => (
                  <button
                    key={option}
                    className={`scale-button ${index === 0 || index === 4 ? "scale-button-large" : ""}`}
                    onClick={() => handleAnswer((index + 1) * 2)}
                  />
                ))}
                <span className="scale-label">Agree</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}