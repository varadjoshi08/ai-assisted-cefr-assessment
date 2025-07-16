export interface UserProfile {
  id: string;
  name: string;
  age?: number;
  nativeLanguage?: string;
  learningGoal: 'fluency' | 'ielts' | 'study-abroad' | 'job-interview';
  targetCEFR: CEFRLevel;
  currentCEFR?: CEFRLevel;
  createdAt: Date;
}

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface TestResult {
  id: string;
  userId: string;
  cefrLevel: CEFRLevel;
  overallScore: number;
  subskills: {
    fluency: number;
    grammar: number;
    vocabulary: number;
    coherence: number;
    pronunciation: number;
  };
  feedback: string;
  audioUrl?: string;
  transcript?: string;
  completedAt: Date;
  duration: number;
}

export interface PracticeSession {
  id: string;
  userId: string;
  topic: string;
  score: number;
  feedback: string;
  completedAt: Date;
  duration: number;
}

export interface CEFRInfo {
  level: CEFRLevel;
  color: string;
  bgColor: string;
  description: string;
  skillDescription: string;
}