import { IconButton, IconButtonProps, styled } from '@mui/material';
import { Plus } from 'lucide-react';

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  width: '120px',
  height: '120px',
  border: `2px dashed ${theme.palette.primary.main}`,
  borderRadius: '50%',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

interface AddMoodButtonProps extends IconButtonProps {
  onOpenWizard: () => void;
}

export default function AddMoodButton({ onOpenWizard, ...props }: AddMoodButtonProps) {
  return (
    <StyledIconButton onClick={onOpenWizard} {...props}>
      <Plus size={48} />
    </StyledIconButton>
  );
}