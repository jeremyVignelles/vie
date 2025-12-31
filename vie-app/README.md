# vie-app

Application web pour VIE (Vérification Informatique des Équipes).

Cette application utilise la bibliothèque `vie` pour fournir une interface utilisateur.

## Développement

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Compiler pour la production
npm run build

# Prévisualiser la version de production
npm run preview
```

## Scripts disponibles

- `npm run dev` - Démarre le serveur de développement Vite
- `npm run build` - Compile l'application pour la production
- `npm run preview` - Prévisualise la version compilée
- `npm run lint` - Vérifie le code avec oxlint
- `npm run type-check` - Vérifie les types TypeScript

## Structure

```
vie-app/
├── src/
│   └── main.ts        # Point d'entrée de l'application
├── index.html         # Page HTML principale
├── vite.config.ts     # Configuration Vite
├── tsconfig.json      # Configuration TypeScript
└── package.json       # Dépendances et scripts
```

## Note

Cette application est privée (`"private": true` dans package.json) et ne sera pas publiée sur NPM. Elle utilise la bibliothèque `vie` en tant que dépendance locale (`"vie": "file:.."`).
