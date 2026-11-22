Initialement, l'image pèse **1.88 GB**. 

## DOCKERFILE : 

### Etape 1 : Optimisation du poid de l'image
* Dans le DockerFile, nous importons les nodes modules ce qui est inutile sachant qu'ils seront installé dans le npm install. J'ai également supprimer les mises à jours du 'apt update& install'.

Après modification, l'image pèse 1.83 en 19.9 s.

### Étape 2 : Modification de version de node
* Modification de version de node en remplaçant `"node:latest"` par `"node:alpine"`.

Le poid de l'image est désormais de 289 MB ! 

### Bonne pratique / Sécurité
* **Dans le Dockerfile,** nous avons "ENV ENV=development" ce qui n'est pas une bonne pratique (SonarCloud, docker:S4507) car on augmente la surface d'attaque. J'ai donc remplacé cela par un code compliant : ENV APP_DEBUG=false
ENV ENV=production.

* le USER en root est une faille de sécurité.
En utilisant node, un profil avec un accès limité, cela va limiter rôles et donc les manipulations potentiellement indésirables. 

* Limiter l'exposition des ports à un seul, ici **3000**.

## Server.js : 

* **Synchrone -> Asynchrone** : Pour le traitement du fichier .txt, nous avons un bout de code qui est synchrone, c'est-à-dire qu'il peut traiter qu'un fichier à la fois, si le fichier est volumineux alors l'application sera en attente du traitement du fichier. J'ai donc basculer en asynchrone, grâce à cela on pourra chargé le fichier lourd sans perturber le fonctionnement global de l'application. (On peut aussi utiliser les Streams).
* **Gestion des logs:** Utilisation de morgan pour avoir des logs avec plus d'information, comme le Verbe http, le code de résultat et le temps de traitment.
    - Fix réalisé car la dépendance n'avait pas été installé. J'ai fait un npm install morgan pour que les dépendances s'intallent sur le package-json.json et package.json.
* **Création du fichier .txt :** Création d'un fichier texte avec quelques lignes pour tester si le server renvoi correctement les lignes.
    - /big renvoyé en 7.126 ms : "GET /big 200 7.126 ms - 2548"

* Cohérence : Harmonisation des noms des variables d'environnement en NODE_ENV dans dockerfile et server.js pour que cela corresponde aussi avec la package.json.

## Package.json : 

* **Mongodb :** Suppression de mongodb dans le package car nous n'en avons pas besoin dans cette application. 

Build de l'image : 12.1s
Poid de l'image : 288 MB 

## Sonar : 

- **Dans le server.js**, utilisation de app.disable('x-powered-by'); car sonar considère comme une faille de sécurité d'exposer l'en tête HTTP.

- **Dans server.js**, ajout de 'node:fs', 'node:path' et 'node' pour spécifier explicitement l'usage.

- **Dans le DockerFile :** Remplacement de 'COPY . ./' par 'COPY package.json maybe-big-file.txt server.js ./' pour donner exactement le fichier dont il a besoin pour fonctionner.
    - Build en 10.2s
    - Poid : 278 MB

# Analyse de l'image

## Taille de l'image
* **Réduction de la taille :** passage de **1.88 GB** à **278 MB**.
* **Optimisations principales :**
  - Passage à `node:alpine` (gain énorme sur la taille de l'image).
  - Retrait de `mongodb` des dépendances.
  - Suppression des copies et installations inutiles.
  - Copie ciblée des fichiers nécessaires (`package.json`, `maybe-big-file.txt`, `server.js`).
* **Temps de build final :** **10.2 s**.
* **Temps final avec le Cache :** **1.7 s**

## Exécution & sécurité
* **Utilisateur :** exécution du conteneur avec l'utilisateur limité `node` à la place de `root`.
* **Réseau :** exposition du port `3000` et alignement des variables d'environnement (`NODE_ENV` / `APP_DEBUG`).
* **Sécurité HTTP :** désactivation de l'en-tête `x-powered-by`.
* **Performance & logs :** lecture asynchrone du fichier sur la route `/big` (`GET /big 200` observé en **7.126 ms**) avec journalisation via `morgan`.

## Intégration Continue (CI) & Docker Compose

Afin d'automatiser la validation de l'image Docker à chaque évolution du dépôt, j'ai créé un fichier `docker-compose.yml`  et un wf GitHub Actions (`.github/workflows/ci.yml`).
* **Gestion (`docker-compose.yml`) :** permet de construire l'image et de démarrer le conteneur sur le port `3000` en mode `production` en une seule commande.
* **Pipeline CI (`ci.yml`) :** à chaque `push` ou `pull_request`, le wf build l'image, vérifie que l'application démarre et fonctionne sur `/` et affiche la taille de l'image  pour suivre les évols, puis nettoie les ressources avec un docker compose down.

A noter : Il aurait été intéréssant de mettre cela en place dès le début du projet afin d'avoir eu toutes les informations sur l'évolutions de la taille de l'image.