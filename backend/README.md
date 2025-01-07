# Lux Tech Evening - S'interfacer avec Odoo

> [!NOTE]
> Ce projet est une version minimaliste d'une application et celle-ci n'est pas destinée à être utilisée en production.

## Présentation
Ce repository contient le code source du backend de l'application permettant de montrer différentes possibilités d'interfacer avec Odoo.

Ce repo contient:
- Une route webhook pour recevoir des données d'Odoo
- Une route websocket pour montrer la notification en temps réelle sur le frontend

## Technique
- [Elysia](https://elysiajs.com/)
- [Bun](https://bun.sh) comme gestionnaire de paquets et runtime
- [Biome](https://biomejs.dev/) en tant que formatter & linter pour remplacer ESLint
