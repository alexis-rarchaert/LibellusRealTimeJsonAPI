const fs = require('node:fs');
const path = require('path');
const csv = require('csv-parser');
const axios = require('axios');
const AdmZip = require('adm-zip');

const gtfsUrl = 'https://www.data.gouv.fr/fr/datasets/r/b2fd45db-63be-4eb1-a6dd-9f104611594b';
const gtfsFolder = './data';
const jsonFolder = './json_data';

axios.get(gtfsUrl, { responseType: 'arraybuffer' })
  .then((response) => {
    const zip = new AdmZip(response.data);
    zip.extractAllTo(gtfsFolder, true);
    }).catch((error) => {
    console.error(`Erreur lors du téléchargement ou de la décompression du fichier GTFS : ${error}`);
});

const lignesDeBus = [];
const trajetsDeBus = [];
const arretIds = new Set();
const arrets = [];
const arretsParLigne = {};

const nomsArretsParLigne = {};

const periods = {};

//On vérifie qu'il y ait des données dans le dossier json_data, si il y a des données, on les traite
fs.readdir(gtfsFolder, (err, files) => {
    if (err) {
        console.error(`Erreur lors de la lecture du dossier ${gtfsFolder} : ${err}`);
        return;
    }
    if (files.length === 0) {
        console.error(`Aucun fichier dans le dossier ${gtfsFolder}`);
        return;
    }

    // On créé le fichier routes.json
    const routes = [];
    fs.createReadStream(path.join(gtfsFolder, 'routes.txt'))
        .pipe(csv())
        .on('data', (data) => {
            // On vérifie si une propriété est vide avant de l'ajouter au tableau
            const filteredData = Object.fromEntries(
                Object.entries(data).filter(([key, value]) => value !== '')
            );
            routes.push(filteredData);
        })
        .on('end', () => {
            fs.writeFileSync(path.join(jsonFolder, 'routes.json'), JSON.stringify(routes, null, 2));
        });

    //On créé le fichier shapes.json
    const shapes = [];
    fs.createReadStream(path.join(gtfsFolder, 'shapes.txt'))
        .pipe(csv())
        .on('data', (data) => {
            // On vérifie si une propriété est vide avant de l'ajouter au tableau
            const filteredData = Object.fromEntries(
                Object.entries(data).filter(([key, value]) => value !== '')
            );
            shapes.push(filteredData);
        })
        .on('end', () => {
            fs.writeFileSync(path.join(jsonFolder, 'shapes.json'), JSON.stringify(shapes, null, 2));
        });

    //On créé le fichier stop_times.json
    const stopTimes = [];
    fs.createReadStream(path.join(gtfsFolder, 'stop_times.txt'))
        .pipe(csv())
        .on('data', (data) => {
            // On vérifie si une propriété est vide avant de l'ajouter au tableau
            const filteredData = Object.fromEntries(
                Object.entries(data).filter(([key, value]) => value !== '')
            );
            stopTimes.push(filteredData);
        })
        .on('end', () => {
            fs.writeFileSync(path.join(jsonFolder, 'stop_times.json'), JSON.stringify(stopTimes, null, 2));
        });

    //On créé le fichier stops.json
    const stops = [];
    fs.createReadStream(path.join(gtfsFolder, 'stops.txt'))
        .pipe(csv())
        .on('data', (data) => {
            // On vérifie si une propriété est vide avant de l'ajouter au tableau
            const filteredData = Object.fromEntries(
                Object.entries(data).filter(([key, value]) => value !== '')
            );
            stops.push(filteredData);
        })
        .on('end', () => {
            fs.writeFileSync(path.join(jsonFolder, 'stops.json'), JSON.stringify(stops, null, 2));
        });

    //On créé le fichier trips.json
    const trips = [];
    fs.createReadStream(path.join(gtfsFolder, 'trips.txt'))
        .pipe(csv())
        .on('data', (data) => {
            // On vérifie si une propriété est vide avant de l'ajouter au tableau
            const filteredData = Object.fromEntries(
                Object.entries(data).filter(([key, value]) => value !== '')
            );
            trips.push(filteredData);
        })
        .on('end', () => {
            fs.writeFileSync(path.join(jsonFolder, 'trips.json'), JSON.stringify(trips, null, 2));
        });

    //On créé le fichier calendar.json
    const calendar = [];
    fs.createReadStream(path.join(gtfsFolder, 'calendar.txt'))
        .pipe(csv())
        .on('data', (data) => {
            // On vérifie si une propriété est vide avant de l'ajouter au tableau
            const filteredData = Object.fromEntries(
                Object.entries(data).filter(([key, value]) => value !== '')
            );
            calendar.push(filteredData);
        })
        .on('end', () => {
            fs.writeFileSync(path.join(jsonFolder, 'calendar.json'), JSON.stringify(calendar, null, 2));
        });
});