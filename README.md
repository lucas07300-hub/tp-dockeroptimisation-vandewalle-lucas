Initialement, l'image pèse 1.88 GB. 

- Etape 1 : Optimisation du poid de l'image -> Dans le DockerFile, nous importons les nodes modules ce qui est inutile sachant qu'ils seront installé dans le npm install. J'ai également supprimer les mises à jours du 'apt update& install'.

Après modification, l'image pèse 1.83 en 19.9 s et 5 étapes.