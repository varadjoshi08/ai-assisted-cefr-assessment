import React from 'react';
import { motion } from 'framer-motion';
import { getCEFRInfo } from '../../utils/cefr';
import { CEFRLevel } from '../../types';

interface CEFRBadgeProps {
  level: CEFRLevel;
  size?: 'sm' | 'md' | 'lg';
  showDescription?: boolean;
}

const CEFRBadge: React.FC<CEFRBadgeProps> = ({ 
  level, 
  size = 'md', 
  showDescription = false 
}) => {
  const cefrInfo = getCEFRInfo(level);

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center space-x-2"
    >
      <span
        className={`inline-flex items-center font-semibold rounded-full ${
          cefrInfo.bgColor
        } ${cefrInfo.color} ${sizeClasses[size]}`}
      >
        {level}
      </span>
      {showDescription && (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">
            {cefrInfo.description}
          </span>
          <span className="text-xs text-gray-500">
            {cefrInfo.skillDescription}
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default CEFRBadge;