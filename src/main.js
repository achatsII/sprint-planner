// Point d'entree : cree le store, branche la persistance, le rendu et les evenements.

import { createStore } from './store.js';
import { reducer, createDemoState, STATUS_ORDER } from './state.js';
import { loadState, saveState } from './persistence.js';
import { render, renderToolbar } from './ui.js';

const store = createStore(reducer, loadState(createDemoState()));

const taskForm = document.querySelector('#task-form');
const titleInput = document.querySelector('#task-title');
const priorityInput = document.querySelector('#task-priority');
const dueDateInput = document.querySelector('#task-due-date');

const undoButton = document.querySelector('#undo-btn');
const redoButton = document.querySelector('#redo-btn');
const resetButton = document.querySelector('#reset-demo');

const handlers = {
  onMove(id, direction) {
    const task = store.getState().tasks.byId[id];
    if (!task) return;

    const index = STATUS_ORDER.indexOf(task.status);
    const nextStatus = STATUS_ORDER[index + direction];
    if (!nextStatus) return;

    store.dispatch({ type: 'MOVE_TASK', payload: { id, status: nextStatus } });
  },
  onDelete(id) {
    store.dispatch({ type: 'DELETE_TASK', payload: { id } });
  },
};

// Le rendu et la sauvegarde sont declenches a chaque changement d'etat.
store.subscribe((state) => {
  render(state, handlers);
  renderToolbar(store);
  saveState(state);
});

taskForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const title = titleInput.value.trim();
  if (!title) return;

  store.dispatch({
    type: 'ADD_TASK',
    payload: {
      id: crypto.randomUUID(),
      title,
      priority: priorityInput.value,
      dueDate: dueDateInput.value,
      status: 'todo',
    },
  });

  taskForm.reset();
  priorityInput.value = 'medium';
});

undoButton.addEventListener('click', () => store.dispatch({ type: 'UNDO' }));
redoButton.addEventListener('click', () => store.dispatch({ type: 'REDO' }));

resetButton.addEventListener('click', () => {
  store.dispatch({ type: 'RESET_DEMO' });
});

// Raccourcis clavier : Ctrl/Cmd+Z (annuler), Ctrl/Cmd+Y ou Ctrl/Cmd+Shift+Z (refaire).
document.addEventListener('keydown', (event) => {
  const ctrl = event.ctrlKey || event.metaKey;
  if (!ctrl) return;

  const key = event.key.toLowerCase();
  if (key === 'z' && !event.shiftKey) {
    event.preventDefault();
    store.dispatch({ type: 'UNDO' });
  } else if (key === 'y' || (key === 'z' && event.shiftKey)) {
    event.preventDefault();
    store.dispatch({ type: 'REDO' });
  }
});

// Premier rendu.
render(store.getState(), handlers);
renderToolbar(store);
