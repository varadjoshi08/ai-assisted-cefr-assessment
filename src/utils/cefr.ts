import { CEFRLevel, CEFRInfo } from '../types';

export const CEFR_INFO: Record<CEFRLevel, CEFRInfo> = {
  A1: {
    level: 'A1',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    description: 'Beginner',
    skillDescription: 'Can use familiar everyday expressions and basic phrases.'
  },
  A2: {
    level: 'A2',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    description: 'Elementary',
    skillDescription: 'Can communicate simple, routine tasks and familiar topics.'
  },
  B1: {
    level: 'B1',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    description: 'Intermediate',
    skillDescription: 'Can handle situations while traveling and express opinions.'
  },
  B2: {
    level: 'B2',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    description: 'Upper Intermediate',
    skillDescription: 'Can interact fluently with native speakers and present clear arguments.'
  },
  C1: {
    level: 'C1',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    description: 'Advanced',
    skillDescription: 'Can express ideas fluently and spontaneously without searching for expressions.'
  },
  C2: {
    level: 'C2',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    description: 'Proficient',
    skillDescription: 'Can understand virtually everything and express themselves precisely.'
  }
};

export const getCEFRInfo = (level: CEFRLevel): CEFRInfo => {
  return CEFR_INFO[level];
};

export const getCEFRScore = (level: CEFRLevel): number => {
  const scores = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 };
  return scores[level];
};

export const getScoreCEFR = (score: number): CEFRLevel => {
  if (score >= 5.5) return 'C2';
  if (score >= 4.5) return 'C1';
  if (score >= 3.5) return 'B2';
  if (score >= 2.5) return 'B1';
  if (score >= 1.5) return 'A2';
  return 'A1';
};