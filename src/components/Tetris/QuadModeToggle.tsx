
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface QuadModeToggleProps {
  enabled: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

const QuadModeToggle: React.FC<QuadModeToggleProps> = ({ 
  enabled, 
  onToggle,
  disabled = false
}) => {
  return (
    <div className="flex items-center justify-between space-x-2 w-full bg-tetris-bg p-2 border-2 border-tetris-border rounded">
      <Label htmlFor="quad-mode" className="text-white font-medium cursor-pointer">
        Quad Mode
      </Label>
      <Switch
        id="quad-mode"
        checked={enabled}
        onCheckedChange={onToggle}
        disabled={disabled}
        className="data-[state=checked]:bg-tetris-t"
      />
    </div>
  );
};

export default QuadModeToggle;
