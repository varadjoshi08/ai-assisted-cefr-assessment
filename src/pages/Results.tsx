import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, BarChart3, TrendingUp, MessageSquare } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import CEFRBadge from '../components/ui/CEFRBadge';
import RadarChart from '../components/charts/RadarChart';
import BarChart from '../components/charts/BarChart';
import { useApp } from '../context/AppContext';
import { generateResultsPDF } from '../utils/pdf';

const Results: React.FC = () => {
  const navigate = useNavigate();
  const { currentResult, user } = useApp();

  if (!currentResult || !user) {
    navigate('/');
    return null;
  }

  const radarData = [
    { subject: 'Fluency', score: currentResult.subskills.fluency, fullMark: 6 },
    { subject: 'Grammar', score: currentResult.subskills.grammar, fullMark: 6 },
    { subject: 'Vocabulary', score: currentResult.subskills.vocabulary, fullMark: 6 },
    { subject: 'Coherence', score: currentResult.subskills.coherence, fullMark: 6 },
    { subject: 'Pronunciation', score: currentResult.subskills.pronunciation, fullMark: 6 },
  ];

  const barData = [
    { name: 'Fluency', score: currentResult.subskills.fluency },
    { name: 'Grammar', score: currentResult.subskills.grammar },
    { name: 'Vocabulary', score: currentResult.subskills.vocabulary },
    { name: 'Coherence', score: currentResult.subskills.coherence },
    { name: 'Pronunciation', score: currentResult.subskills.pronunciation },
  ];

  const handleDownloadReport = async () => {
    await generateResultsPDF(currentResult, user);
  };

  const handleContinue = () => {
    if (currentResult.cefrLevel === user.targetCEFR) {
      navigate('/certificate');
    } else {
      navigate('/practice');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Your Speaking Assessment Results
        </h1>
        <p className="text-lg text-gray-600">
          Completed on {currentResult.completedAt.toLocaleDateString()}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Results */}
        <div className="lg:col-span-2 space-y-6">
          {/* CEFR Level Card */}
          <Card className="p-8 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Your CEFR Level
              </h2>
              <CEFRBadge level={currentResult.cefrLevel} size="lg" showDescription />
              <div className="mt-4">
                <span className="text-3xl font-bold text-gray-900">
                  {currentResult.overallScore.toFixed(1)}
                </span>
                <span className="text-gray-500 ml-1">/6.0</span>
              </div>
            </motion.div>
          </Card>

          {/* Charts */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card className="p-6">
              <RadarChart data={radarData} title="Skill Overview" />
            </Card>
            <Card className="p-6">
              <BarChart data={barData} title="Detailed Scores" />
            </Card>
          </div>

          {/* Feedback */}
          <Card className="p-6">
            <div className="flex items-start space-x-3">
              <MessageSquare className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Personalized Feedback
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {currentResult.feedback}
                </p>
              </div>
            </div>
          </Card>

          {/* Transcript */}
          {currentResult.transcript && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Sample Transcript
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 italic">
                  "{currentResult.transcript}"
                </p>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              What's Next?
            </h3>
            <div className="space-y-3">
              <Button
                onClick={handleDownloadReport}
                variant="outline"
                className="w-full flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Download Report</span>
              </Button>
              
              <Button
                onClick={handleContinue}
                className="w-full flex items-center space-x-2"
              >
                {currentResult.cefrLevel === user.targetCEFR ? (
                  <>
                    <TrendingUp className="h-4 w-4" />
                    <span>Get Certificate</span>
                  </>
                ) : (
                  <>
                    <BarChart3 className="h-4 w-4" />
                    <span>Practice More</span>
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Skill Breakdown */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Skill Breakdown
            </h3>
            <div className="space-y-3">
              {Object.entries(currentResult.subskills).map(([skill, score]) => (
                <div key={skill} className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {skill}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-12 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(score / 6) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {score.toFixed(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Progress to Target */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Progress to Target
            </h3>
            <div className="text-center">
              <div className="mb-2">
                <span className="text-sm text-gray-600">Current: </span>
                <CEFRBadge level={currentResult.cefrLevel} size="sm" />
              </div>
              <div className="mb-4">
                <span className="text-sm text-gray-600">Target: </span>
                <CEFRBadge level={user.targetCEFR} size="sm" />
              </div>
              {currentResult.cefrLevel === user.targetCEFR ? (
                <div className="text-green-600 font-medium">
                  🎉 Target Achieved!
                </div>
              ) : (
                <div className="text-blue-600 font-medium">
                  Keep practicing to reach your goal!
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Results;