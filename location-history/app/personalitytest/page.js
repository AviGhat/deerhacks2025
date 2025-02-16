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
  // State to track answers for each personality type
  const [answers, setAnswers] = useState({ E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 });
  const [step, setStep] = useState(0); // Track current question index
  const [completed, setCompleted] = useState(false); // Track if quiz is completed
  const router = useRouter();

  // Handle user's answer selection
  const handleAnswer = (value) => {
    const key = questions[step].key;
    setAnswers((prev) => ({
      ...prev,
      [key[0]]: prev[key[0]] + value, // Increase score for first trait
      [key[2]]: prev[key[2]] + (10 - value) // Increase opposite trait inversely
    }));

    if (step < questions.length - 1) {
      setStep(step + 1); // Move to next question
    } else {
      setCompleted(true); // Mark quiz as completed
    }
  };

  // Calculate final MBTI personality type
  const calculateResult = () => {
    let mbti = "";
    mbti += answers["E"] >= answers["I"] ? "E" : "I";
    mbti += answers["S"] >= answers["N"] ? "S" : "N";
    mbti += answers["T"] >= answers["F"] ? "T" : "F";
    mbti += answers["J"] >= answers["P"] ? "J" : "P";
    router.push(`/explore/${mbti}`); // Redirect to result page
  };

  return (
    <div className="container">
      <div className="quiz-box">
        {completed ? (
          <div className="result-section">
            <button className="result-button" onClick={calculateResult}>
              See Your Result
            </button>
          </div>
        ) : (
          <div>
            <h2 className="question-text">{questions[step].question}</h2>
            <div className="options-container">
              {["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"].map((option, index) => (
                <button
                  key={option}
                  className="option-button"
                  onClick={() => handleAnswer((index + 1) * 2)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}