
import React from 'react';
import { LeaderboardEntry } from './gameTypes';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Trophy, Award, Medal } from 'lucide-react';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  onClear?: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ entries, onClear }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="w-full">
      {entries.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No high scores yet. Play a game to get on the leaderboard!
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="border-tetris-border">
              <TableHead className="text-white">Rank</TableHead>
              <TableHead className="text-white">Player</TableHead>
              <TableHead className="text-white text-right">Score</TableHead>
              <TableHead className="text-white text-right">Level</TableHead>
              <TableHead className="text-white text-right">Lines</TableHead>
              <TableHead className="text-white text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry, index) => (
              <TableRow key={entry.id} className="border-tetris-border">
                <TableCell>
                  <div className="flex items-center justify-center">
                    {index === 0 && <Trophy className="h-5 w-5 text-yellow-500" />}
                    {index === 1 && <Medal className="h-5 w-5 text-gray-300" />}
                    {index === 2 && <Award className="h-5 w-5 text-amber-700" />}
                    {index > 2 && index + 1}
                  </div>
                </TableCell>
                <TableCell>{entry.playerName}</TableCell>
                <TableCell className="text-right font-mono">{entry.score.toLocaleString()}</TableCell>
                <TableCell className="text-right">{entry.level}</TableCell>
                <TableCell className="text-right">{entry.linesCleared}</TableCell>
                <TableCell className="text-right">{formatDate(entry.date)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default Leaderboard;
