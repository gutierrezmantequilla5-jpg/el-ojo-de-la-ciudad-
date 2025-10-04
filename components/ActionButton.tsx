
import React from 'react';
import type { Action } from '../game/types';

interface ActionButtonProps {
  action: Action;
  onClick: () => void;
  isFrozen: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({ action, onClick, isFrozen }) => {
  const baseClasses = "px-6 py-3 text-xl border-2 tracking-widest transition-all duration-200 ease-in-out focus:outline-none";
  const enabledClasses = "bg-transparent border-yellow-200/80 text-yellow-200/80 hover:bg-yellow-200 hover:text-black focus:bg-yellow-200 focus:text-black";
  const disabledClasses = "bg-transparent border-gray-600 text-gray-600 cursor-not-allowed";

  return (
    <button
      onClick={onClick}
      disabled={isFrozen}
      className={`${baseClasses} ${isFrozen ? disabledClasses : enabledClasses}`}
    >
      {action.label}
    </button>
  );
};

export default ActionButton;
