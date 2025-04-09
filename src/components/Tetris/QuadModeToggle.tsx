
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface QuadModeToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

const QuadModeToggle: React.FC<QuadModeToggleProps> = ({ enabled, onToggle }) => {
  return (
    <div className="flex items-center space-x-2 py-2">
      <Switch 
        id="quad-mode" 
        checked={enabled} 
        onCheckedChange={onToggle} 
      />
      <Label htmlFor="quad-mode" className="text-white/70 cursor-pointer">
        Quad Mode
      </Label>
    </div>
  );
};

export default QuadModeToggle;
