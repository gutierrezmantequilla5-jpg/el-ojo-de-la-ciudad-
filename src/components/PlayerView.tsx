
import React from 'react';

const PlayerView: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm h-16 z-20 pointer-events-none">
      <div className="absolute bottom-0 left-1/4 w-12 h-10 bg-gray-800 border-t-2 border-gray-600 transform -rotate-12 rounded-t-lg">
        <div className="w-full h-2 bg-black"></div>
      </div>
      <div className="absolute bottom-0 right-1/4 w-12 h-10 bg-gray-800 border-t-2 border-gray-600 transform rotate-12 rounded-t-lg">
        <div className="w-full h-2 bg-black"></div>
      </div>
    </div>
  );
};

export default PlayerView;