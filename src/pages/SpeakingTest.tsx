import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Clock, CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import AudioRecorder from '../components/audio/AudioRecorder';
import { useApp } from '../context/AppContext';
import { mockApi } from '../utils/mockApi';

const SpeakingTest: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentResult } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  const testPrompts = [
    {
      id: 1,
      prompt: "Tell me about your favorite hobby. What do you enjoy about it?",
      expectedDuration: 60,
    },
    {
      id: 2,
      prompt: "Describe a memorable travel experience. What made it special?",
      expectedDuration: 90,
    },
    {
      id: 3,
      prompt: "What are your thoughts on the importance of learning foreign languages?",
      expectedDuration: 90,
    },
  ];

  const [responses, setResponses] = useState<Blob[]>([]);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleRecordingComplete = (audioBlob: Blob) => {
    const newResponses = [...responses, audioBlob];
    setResponses(newResponses);

    if (currentStep < testPrompts.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmitTest(newResponses);
    }
  };

  const handleSubmitTest = async (allResponses: Blob[]) => {
    setIsProcessing(true);
    
    try {
      // Simulate processing all responses
      const combinedBlob = new Blob(allResponses, { type: 'audio/wav' });
      const result = await mockApi.processSpeakingTest(combinedBlob);
      
      setCurrentResult(result);
      navigate('/results');
    } catch (error) {
      console.error('Test processing failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isProcessing) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-12 text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-6"
          />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Processing Your Speaking Test
          </h2>
          <p className="text-gray-600 mb-4">
            Our AI is analyzing your responses and preparing detailed feedback...
          </p>
          <div className="flex justify-center items-center space-x-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>This may take up to 30 seconds</span>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Speaking Assessment</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock className="h-4 w-4" />
              <span>{formatTime(timeElapsed)}</span>
            </div>
            <div className="text-sm text-gray-500">
              Question {currentStep + 1} of {testPrompts.length}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / testPrompts.length) * 100}%` }}
            transition={{ duration: 0.5 }}
            className="bg-blue-600 h-2 rounded-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Test Area */}
        <div className="lg:col-span-2">
          <Card className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <MessageCircle className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-600">
                      Question {currentStep + 1}
                    </span>
                  </div>
                  
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    {testPrompts[currentStep].prompt}
                  </h2>
                  
                  <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    <p className="text-sm text-blue-800">
                      💡 <strong>Tip:</strong> Speak naturally and take your time. 
                      Aim for about {testPrompts[currentStep].expectedDuration} seconds.
                    </p>
                  </div>
                </div>

                <AudioRecorder
                  onRecordingComplete={handleRecordingComplete}
                  isDisabled={isProcessing}
                />
              </motion.div>
            </AnimatePresence>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Test Progress
            </h3>
            <div className="space-y-3">
              {testPrompts.map((prompt, index) => (
                <div
                  key={prompt.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg ${
                    index < currentStep
                      ? 'bg-green-50 text-green-700'
                      : index === currentStep
                      ? 'bg-blue-50 text-blue-700'
                      : 'bg-gray-50 text-gray-500'
                  }`}
                >
                  {index < currentStep ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <div className="h-5 w-5 border-2 border-current rounded-full" />
                  )}
                  <span className="text-sm font-medium">
                    Question {index + 1}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Test Guidelines
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <span className="text-blue-600">•</span>
                <span>Speak clearly and at a normal pace</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-600">•</span>
                <span>Take your time to think before answering</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-600">•</span>
                <span>Use examples to support your points</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-600">•</span>
                <span>Don't worry about making small mistakes</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SpeakingTest;