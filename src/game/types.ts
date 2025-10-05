
export type SceneId = 
  | 'START'
  | 'HALLWAY_ENTRY'
  | 'HALLWAY_LOOK_AROUND'
  | 'HALLWAY_SOFA'
  | 'HALLWAY_SOFA_LIFT'
  | 'HALLWAY_CABINET'
  | 'CABINET_FORCE'
  | 'CABINET_FAIL'
  | 'CABINET_PANIC_WAIT'
  | 'CABINET_OPEN_WITH_KEY'
  | 'CABINET_CONTENTS'
  | 'TV_ROOM'
  | 'TV_TOUCH'
  | 'DEATH_ENDING'
  | 'LEAVE_EARLY_ENDING'
  | 'KITCHEN_TRANSITION'
  | 'BACKYARD_START';

export type InventoryItemId = 'llave_oxidada' | 'cuaderno_agencia';

export interface InventoryItem {
    id: InventoryItemId;
    name: string;
    description: string;
}

export interface GameState {
    currentSceneId: SceneId;
    inventory: InventoryItemId[];
    suspicionLevel: number;
    isFrozen: boolean;
    isShaking: boolean;
    isBreathing: boolean;
}

export interface Action {
    label: string;
    targetSceneId: SceneId;
    condition?: (state: GameState) => boolean;
    onPress?: (state: GameState) => GameState;
}

export interface Scene {
    id: SceneId;
    text: string;
    actions: Action[];
}