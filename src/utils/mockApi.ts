import { UserProfile, TestResult, PracticeSession, CEFRLevel } from '../types';

// Mock API responses
export const mockApi = {
  async registerUser(userData: Partial<UserProfile>): Promise<UserProfile> {
    const user: UserProfile = {
      id: Math.random().toString(36).substr(2, 9),
      name: userData.name || 'User',
      age: userData.age,
      nativeLanguage: userData.nativeLanguage,
      learningGoal: userData.learningGoal || 'fluency',
      targetCEFR: userData.targetCEFR || 'B2',
      createdAt: new Date(),
    };
    
    return new Promise((resolve) => {
      setTimeout(() => resolve(user), 1000);
    });
  },

  async processSpeakingTest(audioBlob: Blob): Promise<TestResult> {
    const cefrLevels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const randomLevel = cefrLevels[Math.floor(Math.random() * cefrLevels.length)];
    
    const result: TestResult = {
      id: Math.random().toString(36).substr(2, 9),
      userId: 'user123',
      cefrLevel: randomLevel,
      overallScore: Math.random() * 5 + 1,
      subskills: {
        fluency: Math.random() * 5 + 1,
        grammar: Math.random() * 5 + 1,
        vocabulary: Math.random() * 5 + 1,
        coherence: Math.random() * 5 + 1,
        pronunciation: Math.random() * 5 + 1,
      },
      feedback: `Your speaking demonstrates ${randomLevel} level proficiency. You show good command of vocabulary and grammar structures. To improve, focus on increasing fluency and reducing hesitation. Practice speaking about familiar topics daily to build confidence.`,
      transcript: "Thank you for sharing your thoughts about your favorite movie. I noticed you used past tense correctly and provided good details about the plot and characters.",
      completedAt: new Date(),
      duration: 180,
    };

    return new Promise((resolve) => {
      setTimeout(() => resolve(result), 3000);
    });
  },

  async getMockHistory(): Promise<TestResult[]> {
    const history: TestResult[] = [
      {
        id: '1',
        userId: 'user123',
        cefrLevel: 'B1',
        overallScore: 3.2,
        subskills: {
          fluency: 3.0,
          grammar: 3.5,
          vocabulary: 3.2,
          coherence: 3.0,
          pronunciation: 3.1,
        },
        feedback: 'Good progress! Focus on fluency.',
        completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        duration: 180,
      },
      {
        id: '2',
        userId: 'user123',
        cefrLevel: 'B1',
        overallScore: 3.8,
        subskills: {
          fluency: 3.5,
          grammar: 4.0,
          vocabulary: 3.8,
          coherence: 3.7,
          pronunciation: 3.9,
        },
        feedback: 'Excellent improvement in all areas!',
        completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        duration: 180,
      },
    ];

    return new Promise((resolve) => {
      setTimeout(() => resolve(history), 500);
    });
  },
};