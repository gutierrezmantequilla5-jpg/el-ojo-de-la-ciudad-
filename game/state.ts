
import type { GameState, Scene, InventoryItem, SceneId, InventoryItemId } from './types';

export const initialGameState: GameState = {
  currentSceneId: 'START',
  inventory: [],
  suspicionLevel: 0,
  isFrozen: false,
  isShaking: false,
  isBreathing: true,
};

export const inventoryDetails: Record<InventoryItemId, InventoryItem> = {
  llave_oxidada: {
    id: 'llave_oxidada',
    name: 'Llave Oxidada',
    description: 'Una pequeña llave de latón, cubierta de óxido. Parece de un mueble.',
  },
  cuaderno_agencia: {
    id: 'cuaderno_agencia',
    name: 'Cuaderno de la Agencia',
    description: 'Un cuaderno estándar. La portada tiene el sello de la Agencia. Las páginas están manchadas y arrugadas.',
  },
};

const playSoundAndShake = (state: GameState): GameState => {
  // In a real app, you'd play an audio file here.
  // For now, we simulate the effect.
  console.log("*BANG*");
  return { ...state, isShaking: true, isFrozen: true };
};


export const scenes: Record<SceneId, Scene> = {
  START: {
    id: 'START',
    text: 'Recibes la Ficha 42B. Verificación de bienestar en una dirección conocida por actividad anómala.\nTe encuentras frente a la puerta principal. Está entreabierta.',
    actions: [
      {
        label: 'Entrar con cautela',
        targetSceneId: 'HALLWAY_ENTRY',
      },
    ],
  },
  HALLWAY_ENTRY: {
    id: 'HALLWAY_ENTRY',
    text: 'El vestíbulo está oscuro. El aire es denso y huele a polvo y a algo más... algo dulzón y metálico.\nLa única luz proviene de tu linterna. Ves un viejo sofá, un armario cerrado y una puerta que parece llevar a otra habitación.',
    actions: [
      {
        label: 'Inspeccionar los alrededores',
        targetSceneId: 'HALLWAY_LOOK_AROUND',
      },
      {
        label: 'Salir de la casa',
        targetSceneId: 'LEAVE_EARLY_ENDING',
      },
    ],
  },
  HALLWAY_LOOK_AROUND: {
    id: 'HALLWAY_LOOK_AROUND',
    text: 'Tu haz de luz recorre las paredes. Hay manchas de humedad y el papel tapiz se está despegando.\nEl silencio es pesado. Te concentras en los objetos principales: el sofá y el armario.',
    actions: [
      {
        label: 'Examinar el sofá',
        targetSceneId: 'HALLWAY_SOFA',
      },
      {
        label: 'Examinar el armario',
        targetSceneId: 'HALLWAY_CABINET',
      },
      {
        label: 'Ir hacia la otra puerta',
        targetSceneId: 'TV_ROOM',
      }
    ],
  },
  HALLWAY_SOFA: {
    id: 'HALLWAY_SOFA',
    text: 'El sofá de terciopelo está desgarrado y hundido. Parece que algo pesado estuvo apoyado aquí por mucho tiempo.\nNotas un leve brillo metálico debajo de uno de los cojines.',
    actions: [
      {
        label: 'Intentar levantar el cojín',
        targetSceneId: 'HALLWAY_SOFA_LIFT',
      },
      {
        label: 'Dejarlo y examinar el armario',
        targetSceneId: 'HALLWAY_CABINET',
      },
    ],
  },
  HALLWAY_SOFA_LIFT: {
    id: 'HALLWAY_SOFA_LIFT',
    text: 'Levantas el cojín polvoriento. Debajo, encuentras una pequeña llave de latón oxidada.',
    actions: [
      {
        label: 'Recoger la llave',
        targetSceneId: 'HALLWAY_LOOK_AROUND',
        onPress: (state) => ({ ...state, inventory: [...state.inventory, 'llave_oxidada'] }),
        condition: (state) => !state.inventory.includes('llave_oxidada'),
      },
      {
        label: 'Volver a examinar la habitación',
        targetSceneId: 'HALLWAY_LOOK_AROUND',
        condition: (state) => state.inventory.includes('llave_oxidada'),
      },
    ],
  },
  HALLWAY_CABINET: {
    id: 'HALLWAY_CABINET',
    text: 'Es un armario de madera oscura. La cerradura parece antigua pero robusta. No se abre.',
    actions: [
      {
        label: 'Usar la llave oxidada',
        targetSceneId: 'CABINET_OPEN_WITH_KEY',
        condition: (state) => state.inventory.includes('llave_oxidada'),
      },
      {
        label: 'Intentar forzar la puerta',
        targetSceneId: 'CABINET_FORCE',
      },
      {
        label: 'Dejarlo y examinar el sofá',
        targetSceneId: 'HALLWAY_SOFA',
      },
    ],
  },
  CABINET_FORCE: {
    id: 'CABINET_FORCE',
    text: 'Tiras de la puerta con fuerza. Cruje, pero no cede. Lo intentas de nuevo, con todo tu peso...\n\n...un GOLPE ensordecedor resuena desde el techo, justo encima de ti.',
    actions: [
      {
        label: '...',
        targetSceneId: 'CABINET_FAIL',
        onPress: playSoundAndShake,
      },
    ],
  },
  CABINET_FAIL: {
    id: 'CABINET_FAIL',
    text: 'El corazón te martillea en el pecho. Estás paralizado por el miedo. El polvo cae del techo.\nEl silencio que sigue es peor que el ruido.',
    actions: [
      {
        label: 'Esperar...',
        targetSceneId: 'CABINET_PANIC_WAIT',
        onPress: (state) => ({ ...state, isFrozen: false }),
      },
    ],
  },
  CABINET_PANIC_WAIT: {
    id: 'CABINET_PANIC_WAIT',
    text: 'Tras unos segundos que parecen una eternidad, tu pulso empieza a calmarse. No ha vuelto a sonar nada.\nEstás a salvo. Por ahora.',
    actions: [
      {
        label: 'Volver a examinar el armario',
        targetSceneId: 'HALLWAY_CABINET',
      },
       {
        label: 'Salir de la casa AHORA',
        targetSceneId: 'LEAVE_EARLY_ENDING',
      },
    ],
  },
  CABINET_OPEN_WITH_KEY: {
    id: 'CABINET_OPEN_WITH_KEY',
    text: 'La llave entra en la cerradura con un chirrido metálico. Gira con dificultad, pero finalmente oyes un *clic*.\nLa puerta del armario se abre.',
    actions: [
      {
        label: 'Mirar dentro',
        targetSceneId: 'CABINET_CONTENTS',
      },
    ],
  },
  CABINET_CONTENTS: {
    id: 'CABINET_CONTENTS',
    text: 'Dentro solo hay un objeto: un cuaderno con el sello de la Agencia en la portada. Está cubierto de una extraña mancha orgánica oscura y pegajosa.',
    actions: [
      {
        label: 'Recoger el cuaderno',
        targetSceneId: 'HALLWAY_LOOK_AROUND',
        onPress: (state) => ({ ...state, inventory: [...state.inventory, 'cuaderno_agencia'] }),
        condition: (state) => !state.inventory.includes('cuaderno_agencia'),
      },
       {
        label: 'Cerrar el armario y volver',
        targetSceneId: 'HALLWAY_LOOK_AROUND',
        condition: (state) => state.inventory.includes('cuaderno_agencia'),
      },
    ],
  },
  TV_ROOM: {
    id: 'TV_ROOM',
    text: 'Entras en lo que parece una sala de estar. Un viejo televisor de tubo catódico está en una esquina, mostrando estática blanca.\nEl zumbido es lo único que rompe el silencio. Hay una puerta rota que da a un patio trasero.',
    actions: [
      {
        label: 'Acercarse al televisor',
        targetSceneId: 'TV_TOUCH',
      },
      {
        label: 'Ir hacia el patio trasero',
        targetSceneId: 'KITCHEN_TRANSITION',
      },
      {
        label: 'Volver al vestíbulo',
        targetSceneId: 'HALLWAY_LOOK_AROUND',
      }
    ],
  },
  TV_TOUCH: {
      id: 'TV_TOUCH',
      text: 'Te acercas al televisor. La estática parece llamarte. Sientes una extraña compulsión de tocar la pantalla...',
      actions: [
          {
              label: 'Tocar la pantalla',
              targetSceneId: 'DEATH_ENDING'
          },
          {
              label: 'Apartarse',
              targetSceneId: 'TV_ROOM'
          }
      ]
  },
  KITCHEN_TRANSITION: {
    id: 'KITCHEN_TRANSITION',
    text: 'La puerta te lleva a través de los restos de una cocina. Hay platos rotos y comida podrida por todas partes.\nSales al exterior, al aire fresco de la noche.',
    actions: [
      {
        label: 'Entrar en el patio trasero',
        targetSceneId: 'BACKYARD_START'
      }
    ]
  },
  DEATH_ENDING: {
      id: 'DEATH_ENDING',
      text: 'Al tocar la pantalla, un dolor cegador te atraviesa. La estática te consume. Tu visión se desvanece en un mar de ruido blanco.\n\nFIN DE LA GRABACIÓN',
      actions: []
  },
  LEAVE_EARLY_ENDING: {
      id: 'LEAVE_EARLY_ENDING',
      text: 'Decides que ya has visto suficiente. No hay señales de nadie y la atmósfera es demasiado opresiva. Sales de la casa y cierras el informe.\n\nCASO CERRADO - INCONCLUSO',
      actions: []
  },
  BACKYARD_START: {
      id: 'BACKYARD_START',
      text: 'Estás en el patio trasero. La hierba está alta y descuidada. La luna llena ilumina débilmente un cobertizo al fondo y un pozo oscuro en el centro.\nEl aire aquí se siente diferente. Más... expectante.',
      actions: [
          { label: 'Continuará...', targetSceneId: 'BACKYARD_START' }
      ]
  }
};
