
export interface Competition {
  id: string;
  title: string;
  division: string;
  round: string;
  date: string;
  location: string;
  status: 'Open' | 'Closed' | 'Upcoming';
}

export interface StudentResult {
  id: string;
  studentName: string;
  division: string;
  round: string;
  status: 'Qualified' | 'Pending' | 'Eliminated';
  score: number;
  totalScore: number;
}

export const competitions: Competition[] = [
  {
    id: 'c1',
    title: 'OMCC 2024 - National Round',
    division: 'Senior',
    round: 'National',
    date: 'Oct 26, 2024',
    location: 'Cairo',
    status: 'Open',
  },
  {
    id: 'c2',
    title: 'Alexandria Regional Challenge',
    division: 'Junior',
    round: 'Regional',
    date: 'Nov 12, 2024',
    location: 'Alexandria',
    status: 'Upcoming',
  },
  {
    id: 'c3',
    title: 'Alexandria Regional Challenge',
    division: 'Senior',
    round: 'Regional',
    date: 'Nov 12, 2024',
    location: 'Alexandria',
    status: 'Upcoming',
  },
];

export const studentResults: StudentResult[] = [
  {
    id: 'r1',
    studentName: 'Omar Youssef',
    division: 'Senior',
    round: 'National',
    status: 'Qualified',
    score: 86,
    totalScore: 100,
  },
  {
    id: 'r2',
    studentName: 'Laila Khaled',
    division: 'Junior',
    round: 'Regional',
    status: 'Pending',
    score: 0,
    totalScore: 100, // Score not yet released
  },
];

export const leaderboardData = [
  { rank: 1, name: "Nour El-Din", institution: "STEM School", division: "Senior", score: "98/100", status: "Gold Medal" },
  { rank: 2, name: "Hana Mahmoud", institution: "Cairo International", division: "Senior", score: "96/100", status: "Silver Medal" },
  { rank: 3, name: "Youssef Ibrahim", institution: "Alexandria Uni", division: "Advanced", score: "92/100", status: "Bronze Medal" },
];
