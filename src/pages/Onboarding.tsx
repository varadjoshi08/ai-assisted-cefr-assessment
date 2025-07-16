import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Target, Globe } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { useApp } from '../context/AppContext';
import { mockApi } from '../utils/mockApi';
import { CEFRLevel } from '../types';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    nativeLanguage: '',
    learningGoal: 'fluency' as const,
    targetCEFR: 'B2' as CEFRLevel,
  });

  const learningGoals = [
    { id: 'fluency', label: 'General Fluency', icon: Globe },
    { id: 'ielts', label: 'IELTS Preparation', icon: GraduationCap },
    { id: 'study-abroad', label: 'Study Abroad', icon: Target },
    { id: 'job-interview', label: 'Job Interview', icon: Target },
  ];

  const cefrLevels = [
    { level: 'A1', description: 'Beginner' },
    { level: 'A2', description: 'Elementary' },
    { level: 'B1', description: 'Intermediate' },
    { level: 'B2', description: 'Upper Intermediate' },
    { level: 'C1', description: 'Advanced' },
    { level: 'C2', description: 'Proficient' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = await mockApi.registerUser({
        ...formData,
        age: formData.age ? parseInt(formData.age) : undefined,
      });
      
      setUser(user);
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <GraduationCap className="h-16 w-16 text-blue-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to CEFR Speak
        </h1>
        <p className="text-lg text-gray-600">
          Your AI-powered speaking assessment platform
        </p>
      </motion.div>

      <Card className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Enter your full name"
            />

            <Input
              label="Age (Optional)"
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              placeholder="Enter your age"
            />
          </div>

          <Input
            label="Native Language (Optional)"
            type="text"
            value={formData.nativeLanguage}
            onChange={(e) => setFormData({ ...formData, nativeLanguage: e.target.value })}
            placeholder="e.g., Spanish, Mandarin, Arabic"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Learning Goal
            </label>
            <div className="grid grid-cols-2 gap-3">
              {learningGoals.map((goal) => {
                const Icon = goal.icon;
                return (
                  <motion.button
                    key={goal.id}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFormData({ ...formData, learningGoal: goal.id as any })}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      formData.learningGoal === goal.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-6 w-6 mx-auto mb-2" />
                    <span className="text-sm font-medium">{goal.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Target CEFR Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {cefrLevels.map((level) => (
                <motion.button
                  key={level.level}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setFormData({ ...formData, targetCEFR: level.level as CEFRLevel })}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    formData.targetCEFR === level.level
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-lg font-bold">{level.level}</div>
                  <div className="text-xs">{level.description}</div>
                </motion.button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full"
            size="lg"
          >
            Get Started
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Onboarding;