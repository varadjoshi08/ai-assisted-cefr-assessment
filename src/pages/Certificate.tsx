import React from 'react';
import { motion } from 'framer-motion';
import { Download, Share2, Award, Lock } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import CEFRBadge from '../components/ui/CEFRBadge';
import { useApp } from '../context/AppContext';
import { generateCertificatePDF } from '../utils/pdf';

const Certificate: React.FC = () => {
  const { user, currentResult } = useApp();

  const isUnlocked = currentResult && currentResult.cefrLevel >= (user?.targetCEFR || 'B2');

  const handleDownloadCertificate = async () => {
    if (user && currentResult) {
      await generateCertificatePDF(user, currentResult.cefrLevel);
    }
  };

  const handleShareCertificate = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `CEFR ${currentResult?.cefrLevel} Certificate`,
          text: `I've achieved ${currentResult?.cefrLevel} level in English speaking assessment!`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Certificate link copied to clipboard!');
    }
  };

  if (!isUnlocked) {
    return (
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="h-12 w-12 text-gray-400" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🎯 Certificate Locked
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Keep practicing to unlock your certificate!
            </p>
            
            {user && currentResult && (
              <div className="bg-blue-50 p-6 rounded-xl mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-2">Current Level</div>
                    <CEFRBadge level={currentResult.cefrLevel} size="lg" />
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-2">Target Level</div>
                    <CEFRBadge level={user.targetCEFR} size="lg" />
                  </div>
                </div>
                <div className="mt-6">
                  <div className="text-sm text-gray-600 mb-2">Progress to Target</div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: '75%' }}
                    />
                  </div>
                  <div className="text-sm text-gray-600 mt-2">75% Complete</div>
                </div>
              </div>
            )}

            <div className="space-y-4 text-left max-w-md mx-auto">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm">1</span>
                </div>
                <span className="text-gray-700">Take the speaking assessment</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm">2</span>
                </div>
                <span className="text-gray-700">Practice to improve your skills</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm">3</span>
                </div>
                <span className="text-gray-700">Reach your target CEFR level</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <Award className="h-3 w-3 text-green-600" />
                </div>
                <span className="text-gray-700">Unlock your certificate!</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  const achievedLevel = currentResult?.cefrLevel || user?.targetCEFR || 'B2';
  const completionDate = currentResult?.completedAt || new Date();

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <Award className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          🎉 Congratulations!
        </h1>
        <p className="text-xl text-gray-600">
          You've successfully achieved your CEFR speaking level
        </p>
      </motion.div>

      <Card className="mb-8">
        <div id="certificate-content" className="p-12 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="text-center">
            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-600 mb-4">
                CERTIFICATE OF ACHIEVEMENT
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
            </div>

            <div className="mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                This is to certify that
              </h3>
              <div className="text-5xl font-bold text-blue-600 mb-8">
                {user?.name}
              </div>
              <p className="text-xl text-gray-700 mb-4">
                has successfully demonstrated proficiency in
              </p>
              <p className="text-3xl font-semibold text-gray-900 mb-8">
                English Speaking Skills
              </p>
            </div>

            <div className="mb-8">
              <p className="text-xl text-gray-700 mb-6">
                and has achieved the level of
              </p>
              <div className="flex justify-center mb-8">
                <CEFRBadge level={achievedLevel} size="lg" showDescription />
              </div>
              <p className="text-sm text-gray-600">
                according to the Common European Framework of Reference for Languages (CEFR)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="text-center">
                <div className="border-b-2 border-gray-300 pb-2 mb-2">
                  <span className="text-sm font-medium text-gray-600">Date of Achievement</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  {completionDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="text-center">
                <div className="border-b-2 border-gray-300 pb-2 mb-2">
                  <span className="text-sm font-medium text-gray-600">Certificate ID</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  CEFR-{achievedLevel}-{user?.id?.slice(-8).toUpperCase() || 'XXXXXXXX'}
                </span>
              </div>
            </div>

            <div className="flex justify-center items-center space-x-8">
              <div className="text-center">
                <div className="w-32 h-0.5 bg-gray-400 mb-2"></div>
                <p className="text-sm text-gray-600">CEFR Speak Platform</p>
                <p className="text-xs text-gray-500">AI-Powered Assessment</p>
              </div>
            </div>

            {currentResult && (
              <div className="mt-8 p-6 bg-white rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Assessment Summary
                </h4>
                <div className="grid grid-cols-5 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-medium text-gray-900">Fluency</div>
                    <div className="text-blue-600 font-semibold">{currentResult.subskills.fluency.toFixed(1)}</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-gray-900">Grammar</div>
                    <div className="text-blue-600 font-semibold">{currentResult.subskills.grammar.toFixed(1)}</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-gray-900">Vocabulary</div>
                    <div className="text-blue-600 font-semibold">{currentResult.subskills.vocabulary.toFixed(1)}</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-gray-900">Coherence</div>
                    <div className="text-blue-600 font-semibold">{currentResult.subskills.coherence.toFixed(1)}</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-gray-900">Pronunciation</div>
                    <div className="text-blue-600 font-semibold">{currentResult.subskills.pronunciation.toFixed(1)}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      <div className="flex justify-center space-x-4">
        <Button
          onClick={handleDownloadCertificate}
          className="flex items-center space-x-2"
          size="lg"
        >
          <Download className="h-5 w-5" />
          <span>Download Certificate</span>
        </Button>
        
        <Button
          onClick={handleShareCertificate}
          variant="outline"
          className="flex items-center space-x-2"
          size="lg"
        >
          <Share2 className="h-5 w-5" />
          <span>Share Achievement</span>
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-center mt-8"
      >
        <p className="text-gray-600">
          This certificate verifies your English speaking proficiency as assessed by our AI-powered platform.
          Continue practicing to maintain and improve your skills!
        </p>
      </motion.div>
    </div>
  );
};

export default Certificate;