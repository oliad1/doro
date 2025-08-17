export const getChartColors = (): string[] => {
  return [
    'hsl(200, 70%, 55%)',  // Muted Blue
    'hsl(150, 60%, 50%)',  // Muted Green
    'hsl(350, 70%, 60%)',  // Muted Red
    'hsl(45, 70%, 60%)',   // Muted Orange
    'hsl(280, 60%, 65%)',  // Muted Purple
    'hsl(180, 50%, 55%)',  // Muted Teal
    'hsl(30, 80%, 60%)',   // Muted Amber
    'hsl(320, 50%, 60%)'   // Muted Pink
  ];
};


export const calculateYearProgress = () => {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const endOfYear = new Date(now.getFullYear() + 1, 0, 1);
  const elapsed = now.getTime() - startOfYear.getTime();
  const total = endOfYear.getTime() - startOfYear.getTime();
  return Math.floor((elapsed / total) * 100);
};

type Semester = 'Fall' | 'Winter' | 'Summer';

interface SemesterDates {
  start: Date;
  end: Date;
}

export const getSemesterDates = (date: Date = new Date()): { semester: Semester; dates: SemesterDates } => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  if ((month === 8 && day >= 1) || month === 9 || month === 10 || (month === 11 && day <= 18)) {
    return {
      semester: 'Fall',
      dates: { start: new Date(year, 8, 1), end: new Date(year, 11, 18) }
    };
  } else if ((month === 0 && day >= 6) || month === 1 || month === 2 || (month === 3 && day <= 28)) {
    return {
      semester: 'Winter',
      dates: { start: new Date(year, 0, 6), end: new Date(year, 3, 28) }
    };
  } else {
    return {
      semester: 'Summer',
      dates: { start: new Date(year, 4, 3), end: new Date(year, 7, 20) }
    };
  }
};

export const calculateSemesterProgress = (semesterDates: SemesterDates): number => {
  const now = new Date();
  const { start, end } = semesterDates;
  const total = end.getTime() - start.getTime();
  const elapsed = now.getTime() - start.getTime();
  return Math.max(0, Math.min(100, Math.floor((elapsed / total) * 100)));
};

