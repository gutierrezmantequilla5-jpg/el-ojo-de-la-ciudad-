
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { GameState, Scene, Action, InventoryItem, SceneId } from './game/types';
import { initialGameState, scenes, inventoryDetails } from './game/state';
import ActionButton from './components/ActionButton';
import Logbook from './components/Logbook';
import PlayerView from './components/PlayerView';
import EvidenceAnalysisModal from './components/EvidenceAnalysisModal';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [flashlightPos, setFlashlightPos] = useState({ x: 0, y: 0 });
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  
  const currentScene: Scene = useMemo(() => scenes[gameState.currentSceneId], [gameState.currentSceneId]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setFlashlightPos({ x, y });
  };

  const handleAction = useCallback((action: Action) => {
    if (gameState.isFrozen) return;

    setGameState(prevState => {
      let newState = { ...prevState };
      
      // Apply state mutations from the action
      if (action.onPress) {
        newState = action.onPress(newState);
      }
      
      // Transition to the new scene
      newState.currentSceneId = action.targetSceneId;

      // Reset transient states after transition
      newState.isShaking = false; 

      return newState;
    });
  }, [gameState.isFrozen]);

  const openAnalysisModal = () => {
    if (gameState.inventory.length > 0) {
      setShowAnalysisModal(true);
    }
  };

  const closeAnalysisModal = (suspicionIncrease: number) => {
    setShowAnalysisModal(false);
    setGameState(prevState => ({
      ...prevState,
      suspicionLevel: prevState.suspicionLevel + suspicionIncrease,
    }));
  };

  const flashlightStyle = {
    background: `radial-gradient(circle at ${flashlightPos.x}px ${flashlightPos.y}px, rgba(255, 255, 220, 0.15) 0%, rgba(0,0,0,0) 20%, rgba(0,0,0,0) 100%)`,
  };

  const containerClasses = `
    relative min-h-screen w-full bg-[#050505] text-yellow-200 
    flex flex-col items-center justify-center p-4 overflow-hidden
    ${gameState.isBreathing ? 'breathing-effect' : ''}
    ${gameState.isShaking ? 'shake-effect' : ''}
  `;

  return (
    <div className={containerClasses} onMouseMove={handleMouseMove}>
      <div style={flashlightStyle} className="absolute inset-0 z-10 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-felt.png')] opacity-20 z-0"></div>

      <div className="relative z-20 flex flex-col items-center justify-between h-full w-full max-w-4xl">
        <header className="w-full text-center p-4 border-b-2 border-yellow-200/30">
          <h1 className="text-4xl text-red-600 tracking-widest">FICHA 42B: Verificación de Bienestar</h1>
          <p className="text-lg text-yellow-200/80">Inspector Gómez | Placa #734</p>
        </header>

        <main className="w-full flex-grow flex flex-col items-center justify-center my-8 text-center">
          <p className="text-2xl whitespace-pre-wrap leading-relaxed max-w-3xl" style={{ letterSpacing: '0.05em', lineHeight: '1.6' }}>
            {currentScene.text}
          </p>
        </main>

        <footer className="w-full flex flex-col items-center p-4 border-t-2 border-yellow-200/30 space-y-4">
          <div className="flex flex-wrap justify-center gap-4">
            {currentScene.actions.map((action, index) => {
              const isVisible = action.condition ? action.condition(gameState) : true;
              if (!isVisible) return null;
              
              return (
                <ActionButton 
                  key={`${currentScene.id}-${index}`} 
                  action={action} 
                  onClick={() => handleAction(action)}
                  isFrozen={gameState.isFrozen && action.label !== 'Esperar...'}
                />
              );
            })}
          </div>
        </footer>
      </div>

      <Logbook
        inventory={gameState.inventory}
        inventoryDetails={inventoryDetails}
        onAnalyze={openAnalysisModal}
      />
      <PlayerView />
      
      {showAnalysisModal && (
        <EvidenceAnalysisModal 
          inventory={gameState.inventory}
          inventoryDetails={inventoryDetails}
          onClose={closeAnalysisModal}
        />
      )}
    </div>
  );
};

export default App;