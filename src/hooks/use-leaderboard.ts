import { useState, useEffect } from 'react';
import { LeaderboardEntry } from '@/components/Tetris/gameTypes';

// Local storage key for the leaderboard
const LEADERBOARD_KEY = 'tetris-leaderboard';

// Maximum number of scores to keep
const MAX_SCORES = 10;

export function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  // Load leaderboard data on component mount
  useEffect(() => {
    const storedLeaderboard = localStorage.getItem(LEADERBOARD_KEY);
    if (storedLeaderboard) {
      try {
        setLeaderboard(JSON.parse(storedLeaderboard));
      } catch (error) {
        console.error('Failed to parse leaderboard data:', error);
        setLeaderboard([]);
      }
    }
  }, []);

  // Add a new score to the leaderboard
  const addScore = (score: number, level: number, linesCleared: number, playerName: string = 'Player') => {
    const newEntry: LeaderboardEntry = {
      id: Date.now().toString(),
      playerName,
      score,
      level,
      linesCleared,
      date: new Date().toISOString(),
    };

    // Add new entry and sort by score (highest first)
    const updatedLeaderboard = [...leaderboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_SCORES); // Keep only top scores

    setLeaderboard(updatedLeaderboard);
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updatedLeaderboard));
    
    return updatedLeaderboard;
  };

  // Clear the leaderboard
  const clearLeaderboard = () => {
    setLeaderboard([]);
    localStorage.removeItem(LEADERBOARD_KEY);
  };

  // Check if a score qualifies for the leaderboard
  const qualifiesForLeaderboard = (score: number): boolean => {
    if (leaderboard.length < MAX_SCORES) return true;
    return leaderboard.some(entry => score > entry.score);
  };

  return {
    leaderboard,
    addScore,
    clearLeaderboard,
    qualifiesForLeaderboard,
  };
}
