
import React, { useState, useEffect } from 'react';
import { analyzeEvidence } from '../services/geminiService';
import type { InventoryItemId, InventoryItem } from '../game/types';

interface EvidenceAnalysisModalProps {
  inventory: InventoryItemId[];
  inventoryDetails: Record<InventoryItemId, InventoryItem>;
  onClose: (suspicionIncrease: number) => void;
}

const Spinner: React.FC = () => (
  <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-red-500"></div>
);

const EvidenceAnalysisModal: React.FC<EvidenceAnalysisModalProps> = ({ inventory, inventoryDetails, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [analysisResult, setAnalysisResult] = useState('');

  useEffect(() => {
    const getAnalysis = async () => {
      const itemsToAnalyze = inventory.map(id => inventoryDetails[id]);
      const result = await analyzeEvidence(itemsToAnalyze);
      setAnalysisResult(result);
      setIsLoading(false);
    };

    getAnalysis();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once when the modal is mounted

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-[#0a0a0a] border-2 border-red-600 p-8 w-full max-w-2xl text-center">
        {isLoading ? (
          <>
            <h2 className="text-3xl text-red-500 mb-4 animate-pulse">TRANSMITIENDO A LA CENTRAL...</h2>
            <div className="flex justify-center my-8">
                <Spinner />
            </div>
            <p className="text-yellow-200/70 text-lg">Encriptando y enviando datos de evidencia. Espere análisis...</p>
          </>
        ) : (
          <>
            <h2 className="text-3xl text-red-500 mb-4">INFORME CLASIFICADO RECIBIDO</h2>
            <div className="bg-black p-6 my-6 border border-yellow-200/50">
              <p className="text-2xl text-yellow-200 whitespace-pre-wrap leading-relaxed">{analysisResult}</p>
            </div>
            <button
              onClick={() => onClose(1)} // Increases suspicion level by 1
              className="px-8 py-3 text-xl border-2 tracking-widest transition-colors duration-200 bg-transparent border-yellow-200 text-yellow-200 hover:bg-yellow-200 hover:text-black"
            >
              Cerrar Informe
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default EvidenceAnalysisModal;
