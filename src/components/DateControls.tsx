import { Box, Tooltip, Button } from "@mui/material";


type DateControlsProps = {
    selectedDate: string;
    handleDateChange: (direction: "previous" | "today" | "next") => void;
    isDeveloperMode: boolean;
    setIsDeveloperMode: React.Dispatch<React.SetStateAction<boolean>>;
  };

// Inside DateControls.tsx
const getCurrentDate = () => new Date().toISOString().split("T")[0];

const DateControls: React.FC<DateControlsProps> = ({ selectedDate, handleDateChange }) => (
  <Box sx={{ mt: 2, display: "flex", justifyContent: "center", gap: 2 }}>
    <Tooltip title="Previous Day">
      <Button
        variant="contained"
        onClick={() => handleDateChange("previous")}
        disabled={selectedDate === getCurrentDate()}
      >
        &lt;
      </Button>
    </Tooltip>
    <Tooltip title="Today">
      <Button
        variant="contained"
        onClick={() => handleDateChange("today")}
        sx={{ width: "100px" }}
        disabled={selectedDate === getCurrentDate()}
      >
        Today
      </Button>
    </Tooltip>
    <Tooltip title="Next Day">
      <Button
        variant="contained"
        onClick={() => handleDateChange("next")}
      >
        &gt;
      </Button>
    </Tooltip>
  </Box>
);

export default DateControls;
