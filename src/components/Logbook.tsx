
import React from 'react';
import type { InventoryItemId, InventoryItem } from '../game/types';

interface LogbookProps {
  inventory: InventoryItemId[];
  inventoryDetails: Record<InventoryItemId, InventoryItem>;
  onAnalyze: () => void;
}

const Logbook: React.FC<LogbookProps> = ({ inventory, inventoryDetails, onAnalyze }) => {
  const hasItems = inventory.length > 0;

  return (
    <div className="fixed bottom-16 left-4 z-30 bg-black/70 border-2 border-yellow-200/50 p-4 w-80 text-yellow-200/90">
      <h2 className="text-2xl border-b border-yellow-200/50 mb-2 pb-1 text-red-500">REGISTRO</h2>
      {inventory.length === 0 ? (
        <p className="text-lg italic text-yellow-200/60">Vacío</p>
      ) : (
        <ul className="space-y-2">
          {inventory.map(itemId => (
            <li key={itemId} className="text-lg">
              - {inventoryDetails[itemId].name}
            </li>
          ))}
        </ul>
      )}
      <button
        onClick={onAnalyze}
        disabled={!hasItems}
        className={`w-full mt-4 px-4 py-2 text-lg border-2 transition-colors duration-200 ${
          hasItems 
            ? 'border-red-500 text-red-500 hover:bg-red-500 hover:text-black' 
            : 'border-gray-600 text-gray-600 cursor-not-allowed'
        }`}
      >
        Analizar Evidencia
      </button>
    </div>
  );
};

export default Logbook;