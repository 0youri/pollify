"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [question, setQuestion] = useState<string>("");
  const [choices, setChoices] = useState<string[]>(["", ""]);
  const router = useRouter();

  const addChoice = () => setChoices([...choices, ""]);

  const createPoll = () => {
    const pollData = { question, choices };
    const encoded = btoa(JSON.stringify(pollData))
      .replace(/\+/g, "-") // Replace + with -
      .replace(/\//g, "_") // Replace / with _
      .replace(/=+$/, ""); // Remove = padding
      
    router.push(`/poll/${encoded}`); // Navigate to poll page
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto gap-6 p-4">
      {/* Poll Question Section */}
      <div className="flex flex-col gap-2">
        <label className="text-lg font-semibold">Poll Question</label>
        <input
          type="text"
          placeholder="Enter your poll question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="border p-3 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400"
        />
      </div>
  
      {/* Choices Section */}
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Choices</h2>
        {choices.map((choice, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Choice ${index + 1}`}
            value={choice}
            onChange={(e) => {
              const newChoices = [...choices];
              newChoices[index] = e.target.value;
              setChoices(newChoices);
            }}
            className="border p-2 rounded-md focus:ring-2 focus:ring-gray-300"
          />
        ))}
      </div>
  
      {/* Buttons */}
      <div className="flex flex-col gap-4">
        <button onClick={addChoice} className="p-2 bg-gray-100 shadow-sm hover:shadow-md cursor-pointer rounded-lg transition">Add Choice</button>
        <button onClick={createPoll} className="p-2 bg-green-100 shadow-sm hover:shadow-md cursor-pointer rounded-lg transition">Create Poll</button>
      </div>
    </div>
  );
}