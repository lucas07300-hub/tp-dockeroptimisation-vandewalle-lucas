const express = require('express');
const fs = require('node:fs');
const path = require('node:path');


const app = express();
app.disable('x-powered-by');


// Utilisation d'un logger avec la librairie morgan pour enregistrer les requêtes HTTP
const morgan = require('morgan');
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
// Middleware verbeux et un peu inutile
//app.use((req, res, next) => {
//    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
//    next();
//});


app.get('/', (req, res) => {
res.send('Hello world — serveur volontairement non optimisé mais fonctionnel');
});


//Passaege en asynchrone pour reduire le temp de traitement du fichier
app.get('/big', async (req, res) => {
    const filePath = path.join(__dirname, 'maybe-big-file.txt');
    try {
        const data = await fs.promises.readFile(filePath, 'utf8');
        res.send(data.replaceAll('\n', '<br/>'));
    } catch (error) {
        console.error('Erreur lors de la lecture du fiichier :', error);
        res.status(500).send('Erreur lors de la lecture du fiichier.');
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
console.log(`Serveur démarré sur le port ${PORT}`);
});