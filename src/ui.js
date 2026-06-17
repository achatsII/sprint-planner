// Rendu de l'interface a partir de l'etat.
// render() est le seul endroit qui reconstruit le tableau.

import {
  STATUS_ORDER,
  STATUS_LABELS,
  PRIORITY_LABELS,
  selectTasksByStatus,
} from './state.js';

const template = document.querySelector('#task-card-template');

export function render(state, handlers) {
  STATUS_ORDER.forEach((status) => {
    const list = document.querySelector(`#${status}-list`);
    list.innerHTML = '';

    const tasks = selectTasksByStatus(state, status);

    if (tasks.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'empty-message';
      empty.textContent = `Aucune tache ${STATUS_LABELS[status].toLowerCase()}.`;
      list.appendChild(empty);
      return;
    }

    tasks.forEach((task) => list.appendChild(createCard(task, handlers)));
  });
}

export function renderToolbar(store) {
  document.querySelector('#undo-btn').disabled = !store.canUndo();
  document.querySelector('#redo-btn').disabled = !store.canRedo();
}

function createCard(task, handlers) {
  const card = template.content.firstElementChild.cloneNode(true);
  const title = card.querySelector('h3');
  const badge = card.querySelector('.priority-badge');
  const dueDate = card.querySelector('.due-date');
  const moveLeft = card.querySelector('.move-left');
  const moveRight = card.querySelector('.move-right');
  const deleteButton = card.querySelector('.delete-task');

  card.dataset.taskId = task.id;
  title.textContent = task.title;

  badge.textContent = PRIORITY_LABELS[task.priority];
  badge.classList.add(`priority-${task.priority}`);

  dueDate.textContent = task.dueDate
    ? `Echeance: ${formatDate(task.dueDate)}`
    : 'Aucune echeance';

  const statusIndex = STATUS_ORDER.indexOf(task.status);
  moveLeft.disabled = statusIndex === 0;
  moveRight.disabled = statusIndex === STATUS_ORDER.length - 1;

  moveLeft.addEventListener('click', () => handlers.onMove(task.id, -1));
  moveRight.addEventListener('click', () => handlers.onMove(task.id, 1));
  deleteButton.addEventListener('click', () => handlers.onDelete(task.id));

  return card;
}

function formatDate(value) {
  return new Intl.DateTimeFormat('fr-CA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${value}T12:00:00`));
}
