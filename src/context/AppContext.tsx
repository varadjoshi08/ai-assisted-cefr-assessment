import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserProfile, TestResult, PracticeSession } from '../types';

interface AppContextType {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  currentResult: TestResult | null;
  setCurrentResult: (result: TestResult | null) => void;
  testHistory: TestResult[];
  setTestHistory: (history: TestResult[]) => void;
  practiceHistory: PracticeSession[];
  setPracticeHistory: (history: PracticeSession[]) => void;
  isRecording: boolean;
  setIsRecording: (recording: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentResult, setCurrentResult] = useState<TestResult | null>(null);
  const [testHistory, setTestHistory] = useState<TestResult[]>([]);
  const [practiceHistory, setPracticeHistory] = useState<PracticeSession[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  return (
    <AppContext.Provider value={{
      user,
      setUser,
      currentResult,
      setCurrentResult,
      testHistory,
      setTestHistory,
      practiceHistory,
      setPracticeHistory,
      isRecording,
      setIsRecording,
    }}>
      {children}
    </AppContext.Provider>
  );
};