Initialement, l'image pèse 1.88 GB. 

* DOCKERFILE : 
    - Etape 1 : Optimisation du poid de l'image -> Dans le DockerFile, nous importons les nodes modules ce qui est inutile sachant qu'ils seront installé dans le npm install. J'ai également supprimer les mises à jours du 'apt update& install'.

Après modification, l'image pèse 1.83 en 19.9 s.

    - Etape 2 : Modification de version de node en remplaçant "node:latest" par "node:alpine".

Le poid de l'image est désormais de 289 MB ! 

Bonne pratique/Securité -> Dans le Dockerfile, nous avons "ENV ENV=development" ce qui n'est pas une bonne pratique (SonarCloud, docker:S4507) car on augmente la surface d'attaque. J'ai donc remplacé cela par un code compliant : ENV APP_DEBUG=false
ENV ENV=production.

le USER en root est une faille de sécurité. En utilisant node, un profil avec un accès limité, cela va limiter rôles et donc les manipulations potentiellement indésirables. 
Limiter l'exposition des ports à un seul, ici 3000.

* Server.js : 

    - Synchrone -> Asynchrone : Pour le traitement du fichier .txt, nous avons un bout de code qui est synchrone, c'est-à-dire qu'il peut traiter qu'un fichier à la fois, si le fichier est volumineux alors l'application sera en attente du traitement du fichier. J'ai donc basculer en asynchrone, grâce à cela on pourra chargé le fichier lourd sans perturber le fonctionnement global de l'application. (On peut aussi utiliser les Streams).
    - Gestion des logs: Utilisation de morgan pour avoir des logs avec plus d'information, comme le Verbe http, le code de résultat et le temps de traitment.
        - Fix réalisé car la dépendance n'avait pas été installé. J'ai fait un npm install morgan pour que les dépendances s'intallent sur le package-json.json et package.json.
    - Création du fichier .txt : Création d'un fichier texte avec quelques lignes pour tester si le server renvoi correctement les lignes.
        - /big renvoyé en 7.126 ms : "GET /big 200 7.126 ms - 2548"

    - Cohérence : Harmonisation des noms des variables d'environnement en NODE_ENV dans dockerfile et server.js pour que cela corresponde aussi avec la package.json.

* Package.json : 

    - Mongodb : Suppression de mongodb dans le package car nous n'en avons pas besoin dans cette application. 

Build de l'image : 12.1s
Poid de l'image : 288 MB 