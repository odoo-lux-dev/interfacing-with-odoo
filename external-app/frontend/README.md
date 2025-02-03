# S'interfacer avec Odoo - Application Externe - Frontend

> [!WARNING]
> Ceci est une version minimaliste d'une application et n'est pas destiné à être utilisé en production tel quel.

## Présentation
Ce repository contient le code source du frontend de l'application permettant de montrer différentes possibilités d'interfacer avec Odoo.

Actuellement, trois méthodes principales sont présentées :
- Via la lecture de la route `/json`
- Via l'utilisation de l'API JSON-RPC
- Via l'utilisation des Webhooks

## Technique
Template `react-ts` de [Vite](https://vitejs.dev/), en utilisant :
- [Bun](https://bun.sh) comme gestionnaire de paquets et runtime
- [Biome](https://biomejs.dev/) en tant que formatter & linter pour remplacer ESLint
- [shadcn/ui](https://ui.shadcn.com/) pour les composants
- [Jotai](https://jotai.org/) pour la gestion de l'état

---

## Démarrer le projet en local

### Prérequis
- [Bun](https://bun.sh)

### Étapes

1. Clonez le repository:
   ```bash
   git clone git@github.com:odoo-lux-dev/lux-tech-evening-odoo-interfacing.git
   cd external-app/frontend
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
   http://localhost:5173
   ```

---

# Interfacing with Odoo - External Application - Frontend

> [!WARNING]
> This is a minimalist version of an application and is not intended to be used in production as is.

## Introduction
This repository contains the source code for the frontend of the application demonstrating different possibilities for interfacing with Odoo.

Currently, three main methods are presented:
- Via reading the `/json` route
- Via using the JSON-RPC API
- Via using Webhooks

## Technical Details
Template `react-ts` from [Vite](https://vitejs.dev/), using:
- [Bun](https://bun.sh) as the package manager and runtime
- [Biome](https://biomejs.dev/) as the formatter & linter to replace ESLint
- [shadcn/ui](https://ui.shadcn.com/) for components
- [Jotai](https://jotai.org/) for state management

---

## Starting the project locally

### Prerequisites
- [Bun](https://bun.sh)

### Steps

1. Clone the repository:
   ```bash
   git clone git@github.com:odoo-lux-dev/lux-tech-evening-odoo-interfacing.git
   cd external-app/frontend
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
   http://localhost:5173
   ```

