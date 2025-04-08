
import TetrisGame from "@/components/Tetris/TetrisGame";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-tetris-bg p-4">
      <h1 className="text-4xl font-bold text-white mb-6">Tetris</h1>
      <TetrisGame />
    </div>
  );
};

export default Index;
