import { List, ListItem, ListItemText, Switch, Button } from "@mui/material";

interface DeveloperSettingsProps {
  devMode: boolean;
  onToggleDevMode: () => void;
  onResetIntro: () => void;
}

const DeveloperSettings = ({
  devMode,
  onToggleDevMode,
  onResetIntro,
}: DeveloperSettingsProps) => {
  return (
    <List>
      <ListItem
        sx={{
          display: "flex",
          justifyContent: "space-between",
          py: 2,
        }}
      >
        <ListItemText
          primary="Developer Mode"
          secondary="Enable/disable dev features"
        />
        <Switch checked={devMode} onChange={onToggleDevMode} color="primary" />
      </ListItem>
      <ListItem
        sx={{
          display: "flex",
          justifyContent: "space-between",
          py: 2,
        }}
      >
        <ListItemText
          primary="Reset Intro"
          secondary="Restart the app introduction"
        />
        <Button variant="contained" onClick={onResetIntro}>
          Reset
        </Button>
      </ListItem>
    </List>
  );
};

export default DeveloperSettings;
