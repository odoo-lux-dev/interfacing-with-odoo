# Lux Tech Evening - S'interfacer avec Odoo

> [!NOTE]
> Ce projet est une version minimaliste d'une application et celle-ci n'est pas destinée à être utilisée en production.

## Présentation
Ce repository contient le code source du frontend de l'application permettant de montrer différentes possibilités d'interfacer avec Odoo.

Actuellement, trois méthodes principales sont présentées :
- Via la lecture de la route `/json`
- Via l'utilisation de l'API JSON-RPC
- Via l'utilisation des Webhooks

## Technique
- Template `react-ts` de [Vite](https://vitejs.dev/), en utilisant 
- [Bun](https://bun.sh) comme gestionnaire de paquets et runtime
- [Biome](https://biomejs.dev/) en tant que formatter & linter pour remplacer ESLint
- [shadcn/ui](https://ui.shadcn.com/) pour les composants
- [Jotai](https://jotai.org/) pour la gestion de l'état
