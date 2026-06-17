# Sprint Planner Interview

Mini application vanilla HTML/CSS/JavaScript pour evaluer la capacite d'une candidate a utiliser l'IA generative dans un exercice de developpement.

## Lancer l'application

Option la plus simple :

```bash
npm install
npm run dev
```

Puis ouvrir l'URL affichee dans le terminal.

> L'app utilise des modules JavaScript (`type="module"`), il faut donc la servir
> via `npm run dev`. Ouvrir `index.html` directement avec `file://` ne fonctionnera pas.

## Structure

- `index.html` : structure de l'app.
- `styles.css` : interface et styles.
- `src/store.js` : store avec historique undo/redo.
- `src/state.js` : reducer, actions, etat normalise et selecteurs.
- `src/persistence.js` : sauvegarde localStorage avec version de schema.
- `src/ui.js` : rendu du tableau.
- `src/main.js` : point d'entree qui branche le tout.
