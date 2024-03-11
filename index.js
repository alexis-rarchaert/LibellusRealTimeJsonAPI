const express = require('express');
const request = require('request');
const GtfsRealtimeBindings = require('gtfs-realtime-bindings').transit_realtime;

const utilityBus = require('./homeMadeModules/utilityBus');

const app = express();

const apiDoc = {
  message: 'Bienvenue sur une API de données des bus de l\'agglomération de Castres-Mazamet',
  author: {
    "name": "Alexis RARCHAERT",
    "email": "bonjour@alexis-rarchaert.fr",
    "website": "https://alexis-rarchaert.fr"
  },
  version: '1.0.0',
  data: {
    "static": [
      {
        name: 'routes',
        description: 'Récupère les lignes de bus',
        method: 'GET',
        endpoint: '/routes'
      },
      {
        name: 'routeInfos',
        description: 'Récupère les informations d\'une ligne de bus',
        method: 'GET',
        endpoint: '/routes/:routeId'
      },
      {
        name: 'shapes',
        description: 'Récupère les shapes des bus',
        method: 'GET',
        endpoint: '/shapes'
      },
      {
        name: 'stopTimes',
        description: 'Récupère les horaires de passage aux arrêts',
        method: 'GET',
        endpoint: '/stop_times'
      },
      {
        name: 'stops',
        description: 'Récupère les arrêts de bus',
        method: 'GET',
        endpoint: '/stops'
      },
      {
        name: 'trips',
        description: 'Récupère les voyages des bus',
        method: 'GET',
        endpoint: '/trips'
      },
      {
        name: 'calendar',
        description: 'Récupère le calendrier des bus',
        method: 'GET',
        endpoint: '/calendar'
      },
      {
        name: 'stopInfos',
        description: 'Récupère les informations d\'un arrêt de bus',
        method: 'GET',
        endpoint: '/stops/:stopId'
      },
      {
        name: 'linesThroughStop',
        description: 'Récupère les lignes passant par un arrêt de bus',
        method: 'GET',
        endpoint: '/stops/:stopId/lines'
      },
      {
        name: 'nextBusesStop',
        description: 'Récupère les prochains bus à un arrêt de bus',
        method: 'GET',
        endpoint: '/stops/:stopId/nextBuses'
      },
      {
        name: 'stopsForTrip',
        description: 'Récupère les arrêts d\'un voyage de bus',
        method: 'GET',
        endpoint: '/trips/:tripId/stops'
      },
      {
        name: 'tripDuration',
        description: 'Récupère la durée d\'un voyage de bus',
        method: 'GET',
        endpoint: '/trips/:tripId/duration'
      }
    ],
    "realtime": [
      {
        name: 'gtfs-rt',
        description: 'Récupère les données GTFS-RT des bus de l\'agglomération de Castres-Mazamet',
        method: 'GET',
        endpoint: '/gtfs-rt'
      }
    ]
  }
}

// On ajoute une route pour récupérer les données GTFS-RT
app.get('/gtfs-rt', (req, res) => {
  let requestSettings = {
    method: 'GET',
    url: 'https://www.data.gouv.fr/fr/datasets/r/3fdc110c-a929-4d31-bf3a-0f12eb3f1806',
    encoding: null
  };

  request(requestSettings, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      let feed = GtfsRealtimeBindings.FeedMessage.decode(body);
      res.json(feed);
    } else {
      res.status(500).send('Error retrieving GTFS-RT data');
    }
  });
});

//On ajoute une route pour afficher les lignes des bus
app.get('/routes', (req, res) => {
  res.sendFile(__dirname + '/json_data/routes.json');
});

//On ajoute une route pour afficher les informations d'une ligne
app.get('/routes/:routeId', (req, res) => {
  const routeInfos = utilityBus.getRouteInfos(req.params.routeId);
  res.json(routeInfos);
});

//On ajoute une route pour afficher les shapes des bus
app.get('/shapes', (req, res) => {
  res.sendFile(__dirname + '/json_data/shapes.json');
});

//On ajoute une route pour afficher les stop_times des bus
app.get('/stop_times', (req, res) => {
  res.sendFile(__dirname + '/json_data/stop_times.json');
});

//On ajoute une route pour afficher les stops des bus
app.get('/stops', (req, res) => {
  res.sendFile(__dirname + '/json_data/stops.json');
});

//On ajoute une route pour afficher les trips des bus
app.get('/trips', (req, res) => {
  res.sendFile(__dirname + '/json_data/trips.json');
});

//On ajoute une route pour afficher le calendrier des bus
app.get('/calendar', (req, res) => {
  res.sendFile(__dirname + '/json_data/calendar.json');
});

// On ajoute une route pour afficher les informations d'un arrêt
app.get('/stops/:stopId', (req, res) => {
  const stopInfos = utilityBus.getStopsInfos(req.params.stopId);
  res.json(stopInfos);
});

// On ajoute une route pour afficher les lignes passant par un arrêt
app.get('/stops/:stopId/lines', (req, res) => {
  const lines = utilityBus.getLinesThroughStop(req.params.stopId);
  res.json(lines);
});

// On ajoute une route pour afficher les prochains bus à un arrêt
app.get('/stops/:stopId/nextBuses', (req, res) => {
  const nextBuses = utilityBus.getNextBusesStop(req.params.stopId);
  res.json(nextBuses);
});

// On ajoute une route pour afficher les arrêts d'un voyage
app.get('/trips/:tripId/stops', (req, res) => {
  const stops = utilityBus.getStopsForTrip(req.params.tripId);
  res.json(stops);
});

// On ajoute une route pour afficher la durée d'un voyage
app.get('/trips/:tripId/duration', (req, res) => {
  const duration = utilityBus.getTripsDuration(req.params.tripId);
  res.json(duration);
});

// On ajoute une route pour afficher la documentation de l'API
app.get('/', (req, res) => {
  res.json(apiDoc);
});

// On lance le serveur sur le port 3000
app.listen(3000, () => {
  console.log('Server is running port 3000');
});