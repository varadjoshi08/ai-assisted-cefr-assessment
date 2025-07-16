import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart3, BookOpen, Award, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user, currentResult } = useApp();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/dashboard', icon: BarChart3, label: 'Dashboard' },
    { path: '/practice', icon: BookOpen, label: 'Practice' },
    { path: '/certificate', icon: Award, label: 'Certificate' },
  ];

  const isPracticeDisabled = currentResult && currentResult.cefrLevel >= (user?.targetCEFR || 'B2');
  const isCertificateUnlocked = currentResult && currentResult.cefrLevel >= (user?.targetCEFR || 'B2');

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl border-r border-gray-200 z-50">
      <div className="p-6">
        <Link to="/" className="flex items-center space-x-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">CEFR Speak</h1>
            <p className="text-sm text-gray-500">AI Assessment</p>
          </div>
        </Link>
      </div>

      <nav className="px-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          const isDisabled = (item.path === '/practice' && isPracticeDisabled) || 
                           (item.path === '/certificate' && !isCertificateUnlocked);
          
          return (
            <Link
              key={item.path}
              to={isDisabled ? '#' : item.path}
              className={`relative flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg'
                  : isDisabled
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
              }`}
              onClick={(e) => isDisabled && e.preventDefault()}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
              
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}

              {item.path === '/practice' && isPracticeDisabled && (
                <span className="ml-auto text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                  Goal Reached!
                </span>
              )}

              {item.path === '/certificate' && !isCertificateUnlocked && (
                <span className="ml-auto text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                  Locked
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {user && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">Target: {user.targetCEFR}</p>
              </div>
            </div>
            {currentResult && (
              <div className="text-xs text-gray-600">
                Current Level: <span className="font-semibold text-blue-600">{currentResult.cefrLevel}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;