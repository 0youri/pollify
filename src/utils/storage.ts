export function getVotes(id: string): Record<string, number> {
    return JSON.parse(localStorage.getItem(`poll-votes-${id}`) || "{}");
}
  
export function saveVote(id: string, choice: string) {
    let votes = getVotes(id);
    votes[choice] = (votes[choice] || 0) + 1;
    localStorage.setItem(`poll-votes-${id}`, JSON.stringify(votes));
}