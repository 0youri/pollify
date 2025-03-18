"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

type PollData = {
  question: string;
  choices: string[];
};

export default function Poll() {
  const pathname = usePathname();
  const id = pathname.split("/").pop(); // Extract ID from URL

  const [poll, setPoll] = useState<PollData | null>(null);
  const [votes, setVotes] = useState<Record<string, number>>({});

  const safeDecode = (str: string) => {
    str = str.replace(/-/g, "+").replace(/_/g, "/"); // Convert back to standard Base64
    while (str.length % 4) {
      str += "="; // Add missing padding
    }
    return atob(str);
  };

  useEffect(() => {
    if (id) {
      try {
        const decodedData = JSON.parse(safeDecode(id as string)) as PollData;
        setPoll(decodedData);

        const storedVotes = JSON.parse(localStorage.getItem(`poll-votes-${id}`) || "{}");
        setVotes(storedVotes);
      } catch (error) {
        console.error("Invalid poll data:", error);
      }
    }
  }, [id]);

  const vote = (choice: string) => {
    const newVotes = { ...votes, [choice]: Math.max((votes[choice] || 0) + 1, 0) }; // Prevent negative values
    setVotes(newVotes);
    localStorage.setItem(`poll-votes-${id}`, JSON.stringify(newVotes));
  };

  if (!poll) return <div className="w-full max-w-md mx-auto text-center">Loading poll...</div>;

  return (
    <div className="w-full max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-4">{poll.question}</h1>
      <div className="flex flex-col gap-3">
        {poll.choices.map((choice) => {
          let bgColor = "bg-yellow-100"; // Default color

          const voteCounts = Object.values(votes);
          const maxVotes = voteCounts.length ? Math.max(...voteCounts) : 0;
          const minVotes = voteCounts.length ? Math.min(...voteCounts) : 0;

          const sortedChoices = [...poll.choices].slice().sort((a, b) => (votes[b] || 0) - (votes[a] || 0));
          const highestChoices = sortedChoices.filter((c) => votes[c] === maxVotes);
          const lowestChoices = sortedChoices.filter((c) => votes[c] === minVotes);

          const allZeroVotes = voteCounts.every((count) => count === 0);

          if (allZeroVotes) {
            bgColor = "bg-yellow-100"; // Keep all choices yellow if no votes
          } else if (highestChoices.length === 1 && votes[choice] === maxVotes) {
            bgColor = "bg-green-100"; // The only highest choice gets green
          } else if (lowestChoices.length === 1 && votes[choice] === minVotes) {
            bgColor = "bg-red-100"; // The only lowest choice gets red
          }

          return (
            <button
              key={choice}
              onClick={() => vote(choice)}
              className={`p-3 w-full rounded-md ${bgColor} shadow-sm hover:shadow-md transition cursor-pointer`}
            >
              {choice} ({votes[choice] || 0} votes)
            </button>
          );
        })}
      </div>
        <Link href="/">
            <button className="mt-10 p-2 w-full bg-gray-200 text-black rounded-md shadow-sm hover:shadow-md cursor-pointer transition">
                Return to Home
            </button>
        </Link>
    </div>
  );
}