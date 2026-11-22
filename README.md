Initialement, l'image pèse 1.88 GB. 

- Etape 1 : Optimisation du poid de l'image -> Dans le DockerFile, nous importons les nodes modules ce qui est inutile sachant qu'ils seront installé dans le npm install. J'ai également supprimer les mises à jours du 'apt update& install'.

Après modification, l'image pèse 1.83 en 19.9 s.

- Etape 2 : Modification de version de node en remplaçant "node:latest" par "node:alpine".

Le poid de l'image est désormais de 289 MB ! 

Bonne pratique/Securité -> Dans le Dockerfile, nous avons "ENV ENV=development" ce qui n'est pas une bonne pratique (SonarCloud, docker:S4507) car on augmente la surface d'attaque.J'ai donc remplacé cela par un code compliant : ENV APP_DEBUG=false
ENV ENV=production.