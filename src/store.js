// Store minimaliste avec historique undo/redo.
// Toute mutation passe par dispatch(action) pour que l'historique reste coherent.

export function createStore(reducer, initialState) {
  let history = {
    past: [],
    present: initialState,
    future: [],
  };

  const listeners = new Set();

  function getState() {
    return history.present;
  }

  function notify() {
    listeners.forEach((listener) => listener(getState()));
  }

  function dispatch(action) {
    if (action.type === 'UNDO') {
      if (history.past.length === 0) return;
      const previous = history.past[history.past.length - 1];
      history = {
        past: history.past.slice(0, -1),
        present: previous,
        future: [history.present, ...history.future],
      };
      notify();
      return;
    }

    if (action.type === 'REDO') {
      if (history.future.length === 0) return;
      const next = history.future[0];
      history = {
        past: [...history.past, history.present],
        present: next,
        future: history.future.slice(1),
      };
      notify();
      return;
    }

    const nextPresent = reducer(history.present, action);

    // Si le reducer ne change rien, on n'ajoute pas d'entree d'historique.
    if (nextPresent === history.present) return;

    history = {
      past: [...history.past, history.present],
      present: nextPresent,
      future: [],
    };
    notify();
  }

  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function canUndo() {
    return history.past.length > 0;
  }

  function canRedo() {
    return history.future.length > 0;
  }

  return { getState, dispatch, subscribe, canUndo, canRedo };
}
