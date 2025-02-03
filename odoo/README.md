# S'interfacer avec Odoo - Application Odoo

Ce repository contient le code source des customisations Odoo pour notre application de croissantage.

## Démarrer le projet en local

### Prérequis
- [Odoo v18 configuré](https://www.odoo.com/documentation/18.0/administration/on_premise/source.html)

### Étapes

1. Clonez le repository:
   ```bash
   git clone git@github.com:odoo-lux-dev/lux-tech-evening-odoo-interfacing.git
   ```
2. Lancez la DB:
   1. Sans installation du module `croissantage`: 
      ```bash
      odoo-bin -d mydb --addons-path=odoo
      ```
   2. Avec installation du module `croissantage`:
       ```bash
       odoo-bin -d mydb --addons-path=odoo -i croissantage
       ```
   3. Avec mise à jour du module `croissantage`:
       ```bash
       odoo-bin -d mydb --addons-path=odoo -u croissantage
       ```
3. L'application est accessible à l'adresse suivante:
    ```bash
    http://localhost:8069
    ```

---

# Interfacing with Odoo - Odoo Application

This repository contains the source code for Odoo customizations for our "croissantage" application.

## Starting the project locally

### Prerequisites
- [Configured Odoo v18](https://www.odoo.com/documentation/18.0/administration/on_premise/source.html)

### Steps

1. Clone the repository:
   ```bash
   git clone git@github.com:odoo-lux-dev/lux-tech-evening-odoo-interfacing.git
   ```
2. Launch the DB:
   1. Without installing the `croissantage` module:
      ```bash
      odoo-bin -d mydb --addons-path=odoo
      ```
   2. By installing the `croissantage` module:
       ```bash
       odoo-bin -d mydb --addons-path=odoo -i croissantage
       ```
   3. By updating the `croissantage` module:
       ```bash
       odoo-bin -d mydb --addons-path=odoo -u croissantage
       ```
3. The application is accessible at:
    ```bash
    http://localhost:8069
    ```
