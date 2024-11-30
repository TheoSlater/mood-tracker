export interface MoodData {
    mood: number;
    emotions: string[];
  }
  
  export interface MoodHistory {
    [date: string]: MoodData;
  }