# S'interfacer avec Odoo - Application Externe - Backend

> [!WARNING]
> Ceci est une version minimaliste d'une application et n'est pas destiné à être utilisé en production tel quel.

## Présentation
Ce repository contient le code source du backend de l'application permettant de montrer différentes possibilités d'interfacer avec Odoo.

Il dispose de 2 routes:
- Une route **webhook** pour recevoir des données d'Odoo
- Une route **websocket** pour montrer la notification en temps réel sur le frontend

## Technique
- [Elysia](https://elysiajs.com/)
- [Bun](https://bun.sh) comme gestionnaire de paquets et runtime
- [Biome](https://biomejs.dev/) en tant que formatter & linter pour remplacer ESLint

---

## Démarrer le projet en local

### Prérequis
- [Bun](https://bun.sh)

### Étapes

1. Clonez le repository:
   ```bash
   git clone git@github.com:odoo-lux-dev/lux-tech-evening-odoo-interfacing.git
   cd external-app/backend
   ```
2. Installez les dépendances:
   ```bash
    bun install
    ```
3. Démarrez le serveur:
   ```bash
    bun run dev
    ```
4. L'application est accessible à l'adresse suivante:
   ```bash
   http://localhost:3000
   ```

---

# Interfacing with Odoo - External Application - Backend

> [!WARNING]
> This is a minimalist version of an application and is not intended to be used in production as is.

## Introduction
This repository contains the source code for the backend of the application demonstrating different possibilities for interfacing with Odoo.

It has 2 routes:
- A **webhook** route to receive data from Odoo
- A **websocket** route to show real-time notification on the frontend

## Technical Details
- [Elysia](https://elysiajs.com/)
- [Bun](https://bun.sh) as the package manager and runtime
- [Biome](https://biomejs.dev/) as the formatter & linter to replace ESLint

---

## Starting the project locally

### Prerequisites
- [Bun](https://bun.sh)

### Steps

1. Clone the repository:
   ```bash
   git clone git@github.com:odoo-lux-dev/lux-tech-evening-odoo-interfacing.git
   cd external-app/backend
   ```
2. Install dependencies:
   ```bash
   bun install
   ```
3. Start the server:
   ```bash
   bun run dev
   ```
4. The application is accessible at:
   ```bash
   http://localhost:3000
   ```
