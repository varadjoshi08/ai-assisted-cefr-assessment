import React from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Square, Play, Pause } from 'lucide-react';
import Button from '../ui/Button';
import { useAudioRecording } from '../../hooks/useAudioRecording';

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  isDisabled?: boolean;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ 
  onRecordingComplete, 
  isDisabled = false 
}) => {
  const {
    isRecording,
    audioBlob,
    audioUrl,
    startRecording,
    stopRecording,
    resetRecording,
  } = useAudioRecording();

  const [isPlaying, setIsPlaying] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const handleStartRecording = () => {
    resetRecording();
    startRecording();
  };

  const handleStopRecording = () => {
    stopRecording();
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSubmit = () => {
    if (audioBlob) {
      onRecordingComplete(audioBlob);
    }
  };

  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('ended', () => setIsPlaying(false));
    }
  }, [audioUrl]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center space-y-4">
        {isRecording && (
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center"
          >
            <Mic className="h-12 w-12 text-white" />
          </motion.div>
        )}

        {!isRecording && !audioBlob && (
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
            <MicOff className="h-12 w-12 text-gray-400" />
          </div>
        )}

        {audioBlob && (
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center">
            <Square className="h-12 w-12 text-white" />
          </div>
        )}

        <div className="flex space-x-4">
          {!isRecording && !audioBlob && (
            <Button
              onClick={handleStartRecording}
              disabled={isDisabled}
              className="flex items-center space-x-2"
            >
              <Mic className="h-4 w-4" />
              <span>Start Recording</span>
            </Button>
          )}

          {isRecording && (
            <Button
              onClick={handleStopRecording}
              variant="secondary"
              className="flex items-center space-x-2"
            >
              <Square className="h-4 w-4" />
              <span>Stop Recording</span>
            </Button>
          )}

          {audioBlob && (
            <div className="flex space-x-2">
              <Button
                onClick={handlePlayPause}
                variant="outline"
                className="flex items-center space-x-2"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </Button>
              
              <Button
                onClick={resetRecording}
                variant="ghost"
              >
                Record Again
              </Button>
              
              <Button
                onClick={handleSubmit}
                className="flex items-center space-x-2"
              >
                <span>Submit Recording</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          className="hidden"
          onEnded={() => setIsPlaying(false)}
        />
      )}
    </div>
  );
};

export default AudioRecorder;