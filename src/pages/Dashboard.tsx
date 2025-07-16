import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Volume2, Clock, MessageCircle, BarChart3, Download } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import CEFRBadge from '../components/ui/CEFRBadge';
import RadarChart from '../components/charts/RadarChart';
import { useApp } from '../context/AppContext';
import { mockApi } from '../utils/mockApi';
import { generateResultsPDF } from '../utils/pdf';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, currentResult, setCurrentResult } = useApp();
  const [testState, setTestState] = useState<'idle' | 'starting' | 'conversation' | 'processing' | 'completed'>('idle');
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [conversationStep, setConversationStep] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const conversationPrompts = [
    "Hello! Let's start with something simple. Tell me about your favorite hobby and why you enjoy it.",
    "That's interesting! How long have you been doing this hobby?",
    "Now, let's talk about travel. Describe a place you've visited or would like to visit.",
    "What do you think is the most important skill for success in today's world?",
    "Finally, tell me about a challenge you've overcome and what you learned from it."
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (testState === 'conversation') {
      timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [testState]);

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const startTest = () => {
    setTestState('starting');
    setTimeElapsed(0);
    setConversationStep(0);
    
    setTimeout(() => {
      setTestState('conversation');
      speakPrompt(conversationPrompts[0]);
      setCurrentPrompt(conversationPrompts[0]);
    }, 2000);
  };

  const speakPrompt = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsListening(true);
      utterance.onend = () => {
        setIsListening(false);
        setTimeout(() => {
          setIsRecording(true);
        }, 500);
      };
      
      speechSynthesis.speak(utterance);
    } else {
      setIsListening(false);
      setTimeout(() => {
        setIsRecording(true);
      }, 2000);
    }
  };

  const handleUserResponse = () => {
    setIsRecording(false);
    
    // Simulate user speaking for 15-30 seconds
    const speakingDuration = Math.random() * 15000 + 15000;
    
    setTimeout(() => {
      if (conversationStep < conversationPrompts.length - 1 && timeElapsed < 120) {
        const nextStep = conversationStep + 1;
        setConversationStep(nextStep);
        setCurrentPrompt(conversationPrompts[nextStep]);
        speakPrompt(conversationPrompts[nextStep]);
      } else {
        finishTest();
      }
    }, speakingDuration);
  };

  const finishTest = () => {
    setTestState('processing');
    setIsRecording(false);
    setIsListening(false);
    
    // Simulate AI processing
    setTimeout(async () => {
      try {
        const mockAudioBlob = new Blob(['mock audio data'], { type: 'audio/wav' });
        const result = await mockApi.processSpeakingTest(mockAudioBlob);
        setCurrentResult(result);
        setTestState('completed');
      } catch (error) {
        console.error('Test processing failed:', error);
        setTestState('idle');
      }
    }, 4000);
  };

  const handleDownloadReport = async () => {
    if (currentResult && user) {
      await generateResultsPDF(currentResult, user);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!user) {
    return null;
  }

  if (testState === 'completed' && currentResult) {
    const radarData = [
      { subject: 'Fluency', score: currentResult.subskills.fluency, fullMark: 6 },
      { subject: 'Grammar', score: currentResult.subskills.grammar, fullMark: 6 },
      { subject: 'Vocabulary', score: currentResult.subskills.vocabulary, fullMark: 6 },
      { subject: 'Coherence', score: currentResult.subskills.coherence, fullMark: 6 },
      { subject: 'Pronunciation', score: currentResult.subskills.pronunciation, fullMark: 6 },
    ];

    return (
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Test Results
          </h1>
          <p className="text-xl text-gray-600">
            Your CEFR speaking assessment is complete!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-8 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Your CEFR Level
              </h2>
              <CEFRBadge level={currentResult.cefrLevel} size="lg" showDescription />
              <div className="mt-6">
                <span className="text-4xl font-bold text-gray-900">
                  {currentResult.overallScore.toFixed(1)}
                </span>
                <span className="text-gray-500 ml-1 text-xl">/6.0</span>
              </div>
            </motion.div>
          </Card>

          <Card className="p-6">
            <RadarChart data={radarData} title="Skill Breakdown" />
          </Card>
        </div>

        <Card className="mt-8 p-8">
          <div className="flex items-start space-x-4">
            <MessageCircle className="h-8 w-8 text-blue-600 mt-1" />
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Personalized Feedback
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                {currentResult.feedback}
              </p>
            </div>
          </div>
        </Card>

        <div className="mt-8 flex justify-center space-x-4">
          <Button
            onClick={handleDownloadReport}
            className="flex items-center space-x-2"
            size="lg"
          >
            <Download className="h-5 w-5" />
            <span>Download PDF Report</span>
          </Button>
          
          <Button
            onClick={() => setTestState('idle')}
            variant="outline"
            size="lg"
          >
            Take Another Test
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Speaking Assessment Dashboard
        </h1>
        <p className="text-xl text-gray-600">
          Take your AI-powered CEFR speaking test
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {testState === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-12 text-center">
              <div className="mb-8">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mic className="h-12 w-12 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Ready for Your Speaking Test?
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  This 2-minute AI conversation will assess your English speaking skills
                  and provide detailed CEFR-aligned feedback.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MessageCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">AI Conversation</h3>
                  <p className="text-sm text-gray-600">Natural dialogue with AI prompts</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">2 Minutes</h3>
                  <p className="text-sm text-gray-600">Quick and efficient assessment</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <BarChart3 className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Detailed Results</h3>
                  <p className="text-sm text-gray-600">CEFR level + skill breakdown</p>
                </div>
              </div>

              <Button
                onClick={startTest}
                size="lg"
                className="px-12 py-4 text-xl"
              >
                Start Speaking Test
              </Button>
            </Card>
          </motion.div>
        )}

        {testState === 'starting' && (
          <motion.div
            key="starting"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-12 text-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Mic className="h-12 w-12 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Preparing Your Test...
              </h2>
              <p className="text-lg text-gray-600">
                The AI is getting ready to start your conversation
              </p>
            </Card>
          </motion.div>
        )}

        {testState === 'conversation' && (
          <motion.div
            key="conversation"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Speaking Test in Progress</h2>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Clock className="h-5 w-5" />
                    <span className="font-mono text-lg">{formatTime(timeElapsed)}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Step {conversationStep + 1} of {conversationPrompts.length}
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl mb-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <Volume2 className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">AI Assistant</h3>
                    <p className="text-gray-700 text-lg leading-relaxed">{currentPrompt}</p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                {isListening && (
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="mb-6"
                  >
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                      <Volume2 className="h-10 w-10 text-white" />
                    </div>
                    <p className="text-lg font-medium text-green-600 mt-4">AI is speaking...</p>
                  </motion.div>
                )}

                {isRecording && (
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="mb-6"
                  >
                    <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto">
                      <Mic className="h-10 w-10 text-white" />
                    </div>
                    <p className="text-lg font-medium text-red-600 mt-4">Your turn to speak...</p>
                    <Button
                      onClick={handleUserResponse}
                      className="mt-4"
                      size="lg"
                    >
                      I'm Done Speaking
                    </Button>
                  </motion.div>
                )}

                {!isListening && !isRecording && (
                  <div className="mb-6">
                    <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mx-auto">
                      <MessageCircle className="h-10 w-10 text-gray-600" />
                    </div>
                    <p className="text-lg font-medium text-gray-600 mt-4">Processing...</p>
                  </div>
                )}
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2 mt-8">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(timeElapsed / 120) * 100}%` }}
                  transition={{ duration: 0.5 }}
                  className="bg-blue-600 h-2 rounded-full"
                />
              </div>
            </Card>
          </motion.div>
        )}

        {testState === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-12 text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-24 h-24 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-6"
              />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Analyzing Your Speech...
              </h2>
              <p className="text-lg text-gray-600 mb-4">
                Our AI is processing your responses and generating detailed feedback
              </p>
              <div className="flex justify-center items-center space-x-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>This may take up to 30 seconds</span>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;