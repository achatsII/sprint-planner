// Persistance localStorage avec numero de version de schema.
// Si le schema stocke ne correspond pas, on tente une migration.

const STORAGE_KEY = 'sprint-planner-state';
const SCHEMA_VERSION = 1;

export function loadState(fallbackState) {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return fallbackState;

  try {
    const parsed = JSON.parse(raw);

    if (parsed.version !== SCHEMA_VERSION) {
      return migrate(parsed, fallbackState);
    }

    return parsed.state;
  } catch {
    return fallbackState;
  }
}

export function saveState(state) {
  const payload = JSON.stringify({ version: SCHEMA_VERSION, state });
  localStorage.setItem(STORAGE_KEY, payload);
}

// Pas encore d'anciennes versions a migrer : on repart de l'etat par defaut.
function migrate(_parsed, fallbackState) {
  return fallbackState;
}
