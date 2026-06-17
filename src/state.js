// Etat du domaine + reducer.
//
// L'etat des taches est NORMALISE :
//   tasks.byId   : dictionnaire id -> tache
//   tasks.allIds : ordre global des taches
//
// L'ordre d'affichage dans une colonne suit l'ordre de allIds,
// filtre par statut. Le statut d'une tache determine sa colonne.

export const STATUS_ORDER = ['todo', 'doing', 'done'];

export const STATUS_LABELS = {
  todo: 'A faire',
  doing: 'En cours',
  done: 'Termine',
};

export const PRIORITY_LABELS = {
  low: 'Basse',
  medium: 'Moyenne',
  high: 'Haute',
};

function offsetDate(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export function createDemoState() {
  const demo = [
    { id: 'task-1', title: 'Preparer la demo client', priority: 'high', dueDate: offsetDate(1), status: 'todo' },
    { id: 'task-2', title: 'Valider le contenu de la page accueil', priority: 'medium', dueDate: offsetDate(3), status: 'todo' },
    { id: 'task-3', title: 'Corriger le bug du formulaire', priority: 'high', dueDate: offsetDate(-1), status: 'doing' },
    { id: 'task-4', title: 'Mettre a jour la documentation', priority: 'low', dueDate: '', status: 'done' },
  ];

  return {
    tasks: {
      byId: Object.fromEntries(demo.map((task) => [task.id, task])),
      allIds: demo.map((task) => task.id),
    },
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case 'ADD_TASK': {
      const task = action.payload;
      return {
        ...state,
        tasks: {
          byId: { ...state.tasks.byId, [task.id]: task },
          allIds: [...state.tasks.allIds, task.id],
        },
      };
    }

    case 'DELETE_TASK': {
      const { id } = action.payload;
      if (!state.tasks.byId[id]) return state;

      const byId = { ...state.tasks.byId };
      delete byId[id];

      return {
        ...state,
        tasks: {
          byId,
          allIds: state.tasks.allIds.filter((taskId) => taskId !== id),
        },
      };
    }

    case 'MOVE_TASK': {
      const { id, status } = action.payload;
      const task = state.tasks.byId[id];
      if (!task || task.status === status) return state;

      return {
        ...state,
        tasks: {
          ...state.tasks,
          byId: { ...state.tasks.byId, [id]: { ...task, status } },
        },
      };
    }

    case 'RESET_DEMO':
      return createDemoState();

    default:
      return state;
  }
}

// Selecteur : taches d'une colonne, dans l'ordre de allIds.
export function selectTasksByStatus(state, status) {
  return state.tasks.allIds
    .map((id) => state.tasks.byId[id])
    .filter((task) => task.status === status);
}
