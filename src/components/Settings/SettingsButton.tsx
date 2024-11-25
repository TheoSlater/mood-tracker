import { IconButton } from '@mui/material';
import { Settings } from 'lucide-react';

interface SettingsButtonProps {
  onClick: () => void;
}

const SettingsButton = ({ onClick }: SettingsButtonProps) => {
  return (
    <IconButton
      onClick={onClick}
      sx={{
        position: 'absolute',
        top: 40,  
        left: 16,
        backgroundColor: (theme) => 
          theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'rgba(0, 0, 0, 0.1)',
        '&:hover': {
          backgroundColor: (theme) => 
            theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.2)' 
              : 'rgba(0, 0, 0, 0.2)',
        },
      }}
    >
      <Settings size={24} />
    </IconButton>
  );
};

export default SettingsButton;
