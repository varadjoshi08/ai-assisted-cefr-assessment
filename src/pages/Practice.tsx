import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Volume2, Mic, Target, BookOpen, TrendingUp, Clock } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import CEFRBadge from '../components/ui/CEFRBadge';
import RadarChart from '../components/charts/RadarChart';
import { useApp } from '../context/AppContext';

const Practice: React.FC = () => {
  const { user, currentResult } = useApp();
  const [activeSection, setActiveSection] = useState<'conversation' | 'drills' | null>(null);
  const [practiceState, setPracticeState] = useState<'idle' | 'listening' | 'recording' | 'feedback'>('idle');
  const [currentTopic, setCurrentTopic] = useState('');
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [practiceScore, setPracticeScore] = useState<any>(null);

  const conversationTopics = [
    {
      id: 'climate',
      title: 'Climate Change',
      prompt: 'What are your thoughts on climate change and how can individuals make a difference?',
      difficulty: 'Advanced'
    },
    {
      id: 'technology',
      title: 'Technology in Education',
      prompt: 'How do you think technology is changing the way we learn?',
      difficulty: 'Intermediate'
    },
    {
      id: 'travel',
      title: 'Travel Experiences',
      prompt: 'Tell me about a memorable travel experience and what made it special.',
      difficulty: 'Intermediate'
    },
    {
      id: 'career',
      title: 'Career Goals',
      prompt: 'What are your career aspirations and how are you working towards them?',
      difficulty: 'Advanced'
    }
  ];

  const miniDrills = [
    {
      id: 'pronunciation',
      title: 'Pronunciation Practice',
      description: 'Practice difficult sounds and word stress patterns',
      exercises: [
        'Repeat: "The weather is particularly pleasant today"',
        'Focus on the "th" sound: "Think, thank, thought, through"',
        'Word stress: "PHO-to-graph, pho-TOG-ra-phy, pho-to-GRAPH-ic"'
      ]
    },
    {
      id: 'connectors',
      title: 'Using Connectors',
      description: 'Learn to use linking words effectively',
      exercises: [
        'Use "however" in a sentence about technology',
        'Connect two ideas using "therefore"',
        'Express contrast using "on the other hand"'
      ]
    },
    {
      id: 'vocabulary',
      title: 'Vocabulary Expansion',
      description: 'Learn and practice advanced vocabulary',
      exercises: [
        'Use "substantial" instead of "big" in a sentence',
        'Replace "good" with more specific adjectives',
        'Practice academic vocabulary: analyze, evaluate, synthesize'
      ]
    }
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (practiceState === 'recording') {
      timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [practiceState]);

  const startConversationPractice = (topic: any) => {
    setCurrentTopic(topic.prompt);
    setActiveSection('conversation');
    setPracticeState('listening');
    setTimeElapsed(0);

    // Simulate AI speaking
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(topic.prompt);
      utterance.rate = 0.9;
      utterance.onend = () => {
        setPracticeState('recording');
      };
      speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => {
        setPracticeState('recording');
      }, 3000);
    }
  };

  const finishRecording = () => {
    setPracticeState('feedback');
    
    // Generate mock feedback
    setTimeout(() => {
      const mockScore = {
        fluency: Math.random() * 2 + 3,
        grammar: Math.random() * 2 + 3,
        vocabulary: Math.random() * 2 + 3.5,
        coherence: Math.random() * 2 + 3,
        pronunciation: Math.random() * 2 + 3.2,
      };
      setPracticeScore(mockScore);
    }, 2000);
  };

  const resetPractice = () => {
    setActiveSection(null);
    setPracticeState('idle');
    setCurrentTopic('');
    setTimeElapsed(0);
    setPracticeScore(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Check if practice should be disabled
  const isPracticeDisabled = currentResult && currentResult.cefrLevel >= (user?.targetCEFR || 'B2');

  if (isPracticeDisabled) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="p-12 text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <TrendingUp className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎉 Congratulations!
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            You've reached your target CEFR level of {user?.targetCEFR}!
          </p>
          <div className="flex justify-center mb-6">
            <CEFRBadge level={currentResult.cefrLevel} size="lg" showDescription />
          </div>
          <p className="text-gray-600">
            You can now generate your certificate or continue practicing to maintain your skills.
          </p>
        </Card>
      </div>
    );
  }

  if (activeSection === 'conversation') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            onClick={resetPractice}
            variant="ghost"
            className="mb-4"
          >
            ← Back to Practice Menu
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Conversation Practice
          </h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock className="h-4 w-4" />
              <span>{formatTime(timeElapsed)}</span>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {practiceState === 'listening' && (
            <motion.div
              key="listening"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Card className="p-8">
                <div className="text-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <Volume2 className="h-10 w-10 text-white" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">AI is speaking...</h2>
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <p className="text-lg text-gray-800">{currentTopic}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {practiceState === 'recording' && (
            <motion.div
              key="recording"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Card className="p-8">
                <div className="text-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <Mic className="h-10 w-10 text-white" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Your turn to speak!</h2>
                  <div className="bg-gray-50 p-6 rounded-lg mb-6">
                    <p className="text-lg text-gray-800">{currentTopic}</p>
                  </div>
                  <Button
                    onClick={finishRecording}
                    size="lg"
                    className="px-8"
                  >
                    Finish Speaking
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {practiceState === 'feedback' && (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              {practiceScore ? (
                <div className="space-y-6">
                  <Card className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                      Practice Feedback
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <RadarChart 
                          data={[
                            { subject: 'Fluency', score: practiceScore.fluency, fullMark: 6 },
                            { subject: 'Grammar', score: practiceScore.grammar, fullMark: 6 },
                            { subject: 'Vocabulary', score: practiceScore.vocabulary, fullMark: 6 },
                            { subject: 'Coherence', score: practiceScore.coherence, fullMark: 6 },
                            { subject: 'Pronunciation', score: practiceScore.pronunciation, fullMark: 6 },
                          ]}
                        />
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Skill Scores</h3>
                        {Object.entries(practiceScore).map(([skill, score]) => (
                          <div key={skill} className="flex justify-between items-center">
                            <span className="text-gray-700 capitalize">{skill}</span>
                            <span className="font-semibold text-blue-600">{(score as number).toFixed(1)}/6.0</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Improvement Tips</h3>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-blue-800">
                        Great practice session! You demonstrated good vocabulary usage and clear pronunciation. 
                        To improve further, try to speak more fluently with fewer pauses and use more complex 
                        sentence structures. Keep practicing regularly!
                      </p>
                    </div>
                  </Card>

                  <div className="flex justify-center space-x-4">
                    <Button onClick={resetPractice} variant="outline">
                      Practice Another Topic
                    </Button>
                    <Button onClick={resetPractice}>
                      Back to Menu
                    </Button>
                  </div>
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
                  />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Analyzing your speech...
                  </h2>
                </Card>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Practice Speaking
        </h1>
        <p className="text-xl text-gray-600">
          Improve your skills with AI-powered practice sessions
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* AI Conversation Practice */}
        <Card className="p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Volume2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">AI Conversation Practice</h2>
              <p className="text-gray-600">Real-time voice interaction with AI</p>
            </div>
          </div>

          <div className="space-y-4">
            {conversationTopics.map((topic) => (
              <div
                key={topic.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900">{topic.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    topic.difficulty === 'Advanced' 
                      ? 'bg-red-100 text-red-600' 
                      : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    {topic.difficulty}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{topic.prompt}</p>
                <Button
                  onClick={() => startConversationPractice(topic)}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Play className="h-4 w-4" />
                  <span>Start Practice</span>
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* Mini Drills */}
        <Card className="p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-green-100 rounded-lg">
              <Target className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Mini Drills</h2>
              <p className="text-gray-600">Focused skill improvement exercises</p>
            </div>
          </div>

          <div className="space-y-4">
            {miniDrills.map((drill) => (
              <div
                key={drill.id}
                className="p-4 border border-gray-200 rounded-lg"
              >
                <h3 className="font-semibold text-gray-900 mb-2">{drill.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{drill.description}</p>
                <div className="space-y-2">
                  {drill.exercises.slice(0, 2).map((exercise, index) => (
                    <div key={index} className="text-sm bg-gray-50 p-2 rounded">
                      {exercise}
                    </div>
                  ))}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-3"
                  onClick={() => alert('Drill practice coming soon!')}
                >
                  Practice Now
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Progress Section */}
      {currentResult && (
        <Card className="mt-8 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {currentResult.cefrLevel}
              </div>
              <div className="text-sm text-gray-600">Current Level</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {user?.targetCEFR}
              </div>
              <div className="text-sm text-gray-600">Target Level</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                75%
              </div>
              <div className="text-sm text-gray-600">Progress</div>
            </div>
          </div>
          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: '75%' }}
              />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Practice;