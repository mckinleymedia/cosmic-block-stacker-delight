
import { useState, useEffect } from 'react';
import { LeaderboardEntry } from '@/components/Tetris/gameTypes';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';

// Maximum number of scores to display
const MAX_SCORES = 10;

export function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load leaderboard data from Supabase on component mount
  useEffect(() => {
    fetchLeaderboard();
    
    // Subscribe to real-time updates for the leaderboard
    const channel = supabase
      .channel('public:leaderboard')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'leaderboard' }, 
        () => {
          fetchLeaderboard();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Fetch leaderboard data from Supabase
  const fetchLeaderboard = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('score', { ascending: false })
        .limit(MAX_SCORES);

      if (error) {
        throw error;
      }

      // Convert Supabase data to match our LeaderboardEntry type
      const entries: LeaderboardEntry[] = data.map(entry => ({
        id: entry.id,
        playerName: entry.player_name,
        score: entry.score,
        level: entry.level,
        linesCleared: entry.lines_cleared,
        date: entry.date,
      }));
      
      setLeaderboard(entries);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      toast.error('Failed to load leaderboard');
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new score to the leaderboard
  const addScore = async (score: number, level: number, linesCleared: number, playerName: string = 'Player') => {
    try {
      const { data, error } = await supabase
        .from('leaderboard')
        .insert([
          {
            player_name: playerName,
            score,
            level,
            lines_cleared: linesCleared,
          }
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Fetch the updated leaderboard after adding a score
      await fetchLeaderboard();
      
      // Return a formatted leaderboard (although we'll rely on the real-time update)
      return leaderboard;
    } catch (error) {
      console.error('Error adding score:', error);
      toast.error('Failed to save your score');
      return leaderboard;
    }
  };

  // Clear the leaderboard
  const clearLeaderboard = async () => {
    try {
      const { error } = await supabase
        .from('leaderboard')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows

      if (error) {
        throw error;
      }

      setLeaderboard([]);
      toast.success('Leaderboard cleared');
    } catch (error) {
      console.error('Error clearing leaderboard:', error);
      toast.error('Failed to clear leaderboard');
    }
  };

  // Check if a score qualifies for the leaderboard
  const qualifiesForLeaderboard = async (score: number): Promise<boolean> => {
    if (leaderboard.length < MAX_SCORES) return true;
    
    try {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('score')
        .order('score', { ascending: true })
        .limit(1);

      if (error) {
        throw error;
      }

      // If we have fewer than MAX_SCORES scores, or the new score is better than the lowest score
      return leaderboard.length < MAX_SCORES || (data.length > 0 && score > data[0].score);
    } catch (error) {
      console.error('Error checking leaderboard qualification:', error);
      // Default to true if we can't check
      return true;
    }
  };

  return {
    leaderboard,
    isLoading,
    addScore,
    clearLeaderboard,
    qualifiesForLeaderboard,
    refreshLeaderboard: fetchLeaderboard
  };
}
