import { Box, IconButton, Typography } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { useDayService } from "../hooks/useDayService";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

const DateContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(2),
  minWidth: "400px",
  maxWidth: "600px",
  margin: "0 auto",
}));

const DateItem = styled(Box)<{
  selected?: boolean;
  isToday?: boolean;
}>(({ theme, selected, isToday }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(1),
  paddingLeft: theme.spacing(1.25),
  paddingRight: theme.spacing(1.25),
  borderRadius: 10,
  cursor: "pointer",
  minWidth: "40px",
  backgroundColor: selected
    ? theme.palette.datePicker.selectedBackground
    : "transparent",
  transition: "all 0.2s ease",
  position: "relative",
  border: isToday
    ? `2px solid ${theme.palette.datePicker.selectedBackground}`
    : "2px solid transparent",
  "&:hover": {
    backgroundColor: selected
      ? theme.palette.datePicker.selectedBackground
      : theme.palette.datePicker.hoverBackground,
    transform: "translateY(-2px)",
  },
}));

const MoodIndicator = styled("span")<{ color: string }>(({ color }) => ({
  position: "relative",
  width: 8,
  height: 8,
  borderRadius: "50%",
  backgroundColor: color,
  boxShadow: `0 0 4px ${color}50`,
}));

const DayLabel = styled(Typography)(({ theme }) => ({
  fontSize: "0.75rem",
  fontWeight: 500,
  color: theme.palette.datePicker.dayLabel,
  marginBottom: theme.spacing(0.5),
}));

const DateNumber = styled(Typography)<{
  selected?: boolean;
  isToday?: boolean;
}>(({ theme, selected, isToday }) => ({
  fontSize: "1rem",
  fontWeight: selected || isToday ? 600 : 400,
  color: selected
    ? theme.palette.datePicker.selectedDateNumber
    : isToday
    ? theme.palette.primary.main
    : theme.palette.datePicker.dateNumber,
  marginBottom: theme.spacing(0.5),
}));

interface DatePickerProps {
  selectedDate: number;
  onSelectDate: (date: number) => void;
  moodsByDate: Record<number, number>;
  moodSettings: { colors: string[] }[];
}

export default function DatePicker({
  selectedDate,
  onSelectDate,
  moodsByDate,
  moodSettings,
}: DatePickerProps) {
  const theme = useTheme();
  const { weekData, currentDay } = useDayService();

  return (
    <Box
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <IconButton>
        <ChevronLeft />
      </IconButton>
      <DateContainer>
        {weekData.map((dayInfo) => {
          const isFutureDay =
            dayInfo.year > currentDay.year ||
            (dayInfo.year === currentDay.year &&
              (dayInfo.month > currentDay.month ||
                (dayInfo.month === currentDay.month &&
                  dayInfo.date > currentDay.date)));

          const moodIndex = moodsByDate[dayInfo.date];
          const moodColor =
            moodIndex !== undefined
              ? moodSettings[moodIndex].colors[0]
              : theme.palette.datePicker.border;

          return (
            <DateItem
              key={`${dayInfo.date}-${dayInfo.month}-${dayInfo.year}`}
              selected={selectedDate === dayInfo.date}
              isToday={dayInfo.isToday}
              onClick={() => {
                if (!isFutureDay) {
                  onSelectDate(dayInfo.date);
                }
              }}
              sx={{
                opacity: isFutureDay ? 0.4 : 1,
                pointerEvents: isFutureDay ? "none" : "auto",
                cursor: isFutureDay ? "default" : "pointer",
                "&:hover": isFutureDay
                  ? {}
                  : {
                      backgroundColor:
                        selectedDate === dayInfo.date
                          ? theme.palette.datePicker.selectedBackground
                          : theme.palette.datePicker.hoverBackground,
                      transform: "translateY(-2px)",
                    },
              }}
            >
              <DayLabel>{dayInfo.dayAbbrev}</DayLabel>
              <DateNumber
                selected={selectedDate === dayInfo.date}
                isToday={dayInfo.isToday}
              >
                {dayInfo.date}
              </DateNumber>
              <MoodIndicator color={moodColor} />
            </DateItem>
          );
        })}
      </DateContainer>
      <IconButton>
        <ChevronRight />
      </IconButton>
    </Box>
  );
}
