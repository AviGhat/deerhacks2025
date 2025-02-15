'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const questions = [
  { question: "You prefer to focus on the outer world or your inner world?", options: ["Extraversion (E)", "Introversion (I)"] },
  { question: "You prefer to focus on the basic information you take in or do you interpret and add meaning?", options: ["Sensing (S)", "Intuition (N)"] },
  { question: "When making decisions, do you prefer to look at logic and consistency or at people and special circumstances?", options: ["Thinking (T)", "Feeling (F)"] },
  { question: "Do you prefer to get things decided or stay open to new information and options?", options: ["Judging (J)", "Perceiving (P)"] },
];

export default function MBTITest() {
  const [answers, setAnswers] = useState({ E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 });
  const [step, setStep] = useState(0);
  const [result, setResult] = useState("");
  const router = useRouter();

  const handleAnswer = (option) => {
    setAnswers((prev) => ({ ...prev, [option[0]]: prev[option[0]] + 1 }));
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      calculateResult();
    }
  };

  const calculateResult = () => {
    let mbti = "";
    mbti += answers["E"] >= answers["I"] ? "E" : "I";
    mbti += answers["S"] >= answers["N"] ? "S" : "N";
    mbti += answers["T"] >= answers["F"] ? "T" : "F";
    mbti += answers["J"] >= answers["P"] ? "J" : "P";
    setResult(mbti);
    router.push(`/explore/${mbti}`);
  };

  // fix css later like tmrw
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        {result ? (
          <div>
            <h2 className="text-xl font-bold">Your MBTI Type: {result}</h2>
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-semibold">{questions[step].question}</h2>
            <div className="mt-4 space-y-2">
              {questions[step].options.map((option) => (
                <button
                  key={option}
                  className="block w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                  onClick={() => handleAnswer(option)}
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
