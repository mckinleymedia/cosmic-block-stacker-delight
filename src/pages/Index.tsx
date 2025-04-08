
import TetrisGame from "@/components/Tetris/TetrisGame";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-tetris-bg p-4">
      <h1 className="text-5xl font-bold text-white mb-6 font-mono tracking-wider">
        <span className="text-tetris-i">T</span>
        <span className="text-tetris-j">E</span>
        <span className="text-tetris-l">T</span>
        <span className="text-tetris-o">R</span>
        <span className="text-tetris-s">I</span>
        <span className="text-tetris-t">S</span>
      </h1>
      <div className="text-white text-center mb-4">
        <p className="font-mono">Arrow keys to move • Space to drop • Click Start to begin</p>
      </div>
      <TetrisGame />
    </div>
  );
};

export default Index;
