import { Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText, Switch, IconButton, Typography, Button, Divider, Box } from '@mui/material';
import { X as CloseIcon, Trash2 } from 'lucide-react';

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
  darkMode: boolean;
  onToggleTheme: () => void;
  onDeleteData: () => void;
}

const SettingsDialog = ({ open, onClose, darkMode, onToggleTheme, onDeleteData }: SettingsDialogProps) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: {
          minWidth: { xs: '90%', sm: 400 },
          maxWidth: { xs: '90%', sm: 400 },
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1
      }}>
        Settings
        <IconButton onClick={onClose} size="small">
          <CloseIcon size={20} />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 0 }}>
        <List>
          <ListItem sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            py: 2
          }}>
            <ListItemText 
              primary="Dark Mode" 
              secondary="Toggle dark/light theme"
            />
            <Switch
              checked={darkMode}
              onChange={onToggleTheme}
              color="primary"
            />
          </ListItem>
        </List>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mt: 3 }}>
          <Typography 
            variant="h6" 
            color="error" 
            sx={{ 
              mb: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <Trash2 size={20} />
            Danger Zone
          </Typography>
          
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ mb: 2 }}
          >
            Warning: This action cannot be undone. All your mood data will be permanently deleted.
          </Typography>

          <Button
            variant="outlined"
            color="error"
            onClick={onDeleteData}
            startIcon={<Trash2 size={16} />}
            fullWidth
            sx={{
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
                backgroundColor: 'error.main',
                color: 'white'
              }
            }}
          >
            Delete All Data
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;