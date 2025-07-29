import { Box, Typography, Paper } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";

const DateContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(2),
  backgroundColor: theme.palette.datePicker.background,
  borderRadius: theme.spacing(1),
  minWidth: "400px",
  maxWidth: "600px",
  margin: "0 auto",
  border: `1px solid ${theme.palette.datePicker.border}`,
}));

const DateItem = styled(Box)<{ selected?: boolean }>(({ theme, selected }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(1),
  borderRadius: theme.spacing(1),
  cursor: "pointer",
  minWidth: "40px",
  backgroundColor: selected
    ? theme.palette.datePicker.selectedBackground
    : "transparent",
  transition: "background-color 0.2s ease",
  position: "relative",
  "&:hover": {
    backgroundColor: selected
      ? theme.palette.datePicker.selectedBackground
      : theme.palette.datePicker.hoverBackground,
  },
}));

const MoodIndicator = styled("span")<{ color: string }>(({ color }) => ({
  position: "relative",
  width: 8,
  height: 8,
  borderRadius: "50%",
  backgroundColor: color,
}));

const DayLabel = styled(Typography)(({ theme }) => ({
  fontSize: "0.75rem",
  fontWeight: 500,
  color: theme.palette.datePicker.dayLabel,
  marginBottom: theme.spacing(0.5),
}));

const DateNumber = styled(Typography)<{ selected?: boolean }>(
  ({ theme, selected }) => ({
    fontSize: "1rem",
    fontWeight: selected ? 600 : 400,
    color: selected
      ? theme.palette.datePicker.selectedDateNumber
      : theme.palette.datePicker.dateNumber,
    marginBottom: theme.spacing(0.5),
  })
);

interface DateData {
  day: string;
  date: number;
}

interface DatePickerProps {
  selectedDate: number;
  onSelectDate: (date: number) => void;
  moodsByDate: Record<number, number>;
  moodSettings: { colors: string[] }[];
}

const getStartOfWeek = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

const formatDate = (date: Date): { day: string; date: number } => {
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  return {
    day: days[date.getDay()],
    date: date.getDate(),
  };
};

const generateWeekData = (): DateData[] => {
  const today = new Date();
  const startOfWeek = getStartOfWeek(today);
  const weekData: DateData[] = [];

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startOfWeek);
    currentDate.setDate(startOfWeek.getDate() + i);
    const formatted = formatDate(currentDate);

    weekData.push({
      day: formatted.day,
      date: formatted.date,
    });
  }

  return weekData;
};

export default function DatePicker({
  selectedDate,
  onSelectDate,
  moodsByDate,
  moodSettings,
}: DatePickerProps) {
  const theme = useTheme();
  const dateData: DateData[] = generateWeekData();

  return (
    <Box>
      <Paper elevation={1}>
        <DateContainer>
          {dateData.map((item) => {
            const moodIndex = moodsByDate[item.date];
            const moodColor =
              moodIndex !== undefined
                ? moodSettings[moodIndex].colors[0]
                : theme.palette.datePicker.border;

            return (
              <DateItem
                key={item.date}
                selected={selectedDate === item.date}
                onClick={() => onSelectDate(item.date)}
              >
                <DayLabel>{item.day}</DayLabel>
                <DateNumber selected={selectedDate === item.date}>
                  {item.date}
                </DateNumber>
                <MoodIndicator color={moodColor} />
              </DateItem>
            );
          })}
        </DateContainer>
      </Paper>
    </Box>
  );
}
