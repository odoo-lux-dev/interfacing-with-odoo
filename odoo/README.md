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
