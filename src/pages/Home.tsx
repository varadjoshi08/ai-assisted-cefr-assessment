import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Target, Globe, GraduationCap } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { useApp } from '../context/AppContext';
import { CEFRLevel } from '../types';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    age: user?.age?.toString() || '',
    nativeLanguage: user?.nativeLanguage || '',
    learningGoal: user?.learningGoal || 'fluency' as const,
    targetCEFR: user?.targetCEFR || 'B2' as CEFRLevel,
  });

  const learningGoals = [
    { id: 'fluency', label: 'General Fluency', icon: Globe },
    { id: 'ielts', label: 'IELTS Preparation', icon: GraduationCap },
    { id: 'toefl', label: 'TOEFL Preparation', icon: GraduationCap },
    { id: 'study-abroad', label: 'Study Abroad', icon: Target },
    { id: 'job-interview', label: 'Job Interview', icon: Target },
  ];

  const cefrLevels = [
    { level: 'A1', description: 'Beginner', color: 'bg-red-100 text-red-800' },
    { level: 'A2', description: 'Elementary', color: 'bg-orange-100 text-orange-800' },
    { level: 'B1', description: 'Intermediate', color: 'bg-yellow-100 text-yellow-800' },
    { level: 'B2', description: 'Upper Intermediate', color: 'bg-green-100 text-green-800' },
    { level: 'C1', description: 'Advanced', color: 'bg-blue-100 text-blue-800' },
    { level: 'C2', description: 'Proficient', color: 'bg-purple-100 text-purple-800' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userProfile = {
        id: user?.id || Math.random().toString(36).substr(2, 9),
        name: formData.name,
        age: formData.age ? parseInt(formData.age) : undefined,
        nativeLanguage: formData.nativeLanguage || undefined,
        learningGoal: formData.learningGoal,
        targetCEFR: formData.targetCEFR,
        createdAt: user?.createdAt || new Date(),
      };
      
      setUser(userProfile);
      
      // Save to localStorage
      localStorage.setItem('cefrUser', JSON.stringify(userProfile));
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Profile save failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load from localStorage on component mount
  React.useEffect(() => {
    const savedUser = localStorage.getItem('cefrUser');
    if (savedUser && !user) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setFormData({
          name: parsedUser.name || '',
          age: parsedUser.age?.toString() || '',
          nativeLanguage: parsedUser.nativeLanguage || '',
          learningGoal: parsedUser.learningGoal || 'fluency',
          targetCEFR: parsedUser.targetCEFR || 'B2',
        });
      } catch (error) {
        console.error('Failed to load saved user:', error);
      }
    }
  }, [user, setUser]);

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center mb-4">
          <div className="p-4 bg-blue-600 rounded-2xl">
            <User className="h-12 w-12 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {user ? 'Update Your Profile' : 'Welcome to CEFR Speak'}
        </h1>
        <p className="text-xl text-gray-600">
          Set up your profile to begin your English speaking journey
        </p>
      </motion.div>

      <Card className="p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name *"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Enter your full name"
              />

              <Input
                label="Age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                placeholder="Enter your age"
                min="10"
                max="100"
              />
            </div>

            <div className="mt-6">
              <Input
                label="Native Language (Optional)"
                type="text"
                value={formData.nativeLanguage}
                onChange={(e) => setFormData({ ...formData, nativeLanguage: e.target.value })}
                placeholder="e.g., Spanish, Mandarin, Arabic, Hindi"
              />
            </div>
          </div>

          {/* Learning Goal */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Learning Goal</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {learningGoals.map((goal) => {
                const Icon = goal.icon;
                return (
                  <motion.button
                    key={goal.id}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFormData({ ...formData, learningGoal: goal.id as any })}
                    className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                      formData.learningGoal === goal.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    <Icon className="h-8 w-8 mb-3" />
                    <h3 className="font-semibold text-lg mb-1">{goal.label}</h3>
                    <p className="text-sm opacity-75">
                      {goal.id === 'fluency' && 'Improve overall speaking confidence'}
                      {goal.id === 'ielts' && 'Prepare for IELTS speaking test'}
                      {goal.id === 'toefl' && 'Prepare for TOEFL speaking test'}
                      {goal.id === 'study-abroad' && 'Academic communication skills'}
                      {goal.id === 'job-interview' && 'Professional communication'}
                    </p>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Target CEFR Level */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Target CEFR Level</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {cefrLevels.map((level) => (
                <motion.button
                  key={level.level}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFormData({ ...formData, targetCEFR: level.level as CEFRLevel })}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                    formData.targetCEFR === level.level
                      ? 'border-blue-500 bg-blue-50 shadow-lg transform scale-105'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <div className={`text-2xl font-bold mb-2 px-3 py-1 rounded-lg ${level.color}`}>
                    {level.level}
                  </div>
                  <div className="text-sm font-medium text-gray-700">{level.description}</div>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="pt-6">
            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full py-4 text-lg"
              size="lg"
            >
              {user ? 'Update Profile' : 'Start Your Journey'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Home;