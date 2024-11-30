import { useState } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { MoreVertical } from 'lucide-react';

interface MoodMenuProps {
  onEdit: () => void;
  disabled?: boolean;
}

export default function MoodMenu({ onEdit, disabled = false }: MoodMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleClose();
    onEdit();
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        disabled={disabled}
        sx={{ position: 'absolute', top: 8, right: 8 }}
      >
        <MoreVertical size={24} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleEdit}>Edit Mood</MenuItem>
      </Menu>
    </>
  );
}