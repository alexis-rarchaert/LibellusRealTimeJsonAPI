const fs = require('node:fs');

const allTrips = require('../json_data/trips.json');
const stopTimesData = require('../json_data/stop_times.json');
const routes = require('../json_data/routes.json');

function getStopsForTrip(tripId) { //On récupère les arrêts d'un voyage
    const StopsForTrip = [];

    const stopsDataForTrop = stopTimesData.filter(stopTime => stopTime.trip_id === tripId);

    stopsDataForTrop.forEach(stopTime => {
        StopsForTrip.push(stopTime.stop_id);
    });

    return StopsForTrip;
}

function getStopsInfos(stopId) { //On récupère les informations d'un arrêt
    const stops = require('../json_data/stops.json');
    const stopInfos = stops.find(stop => stop.stop_id === stopId);

    return stopInfos;
}

function getTripsDuration(tripId) { //On récupère la durée d'un voyage en minutes
    //On récupère les horaires de passage aux arrêts
    const stopTimesForTrip = stopTimesData.filter(stopTime => stopTime.trip_id === tripId);
    //On récupère le tout premier horaire de passage
    const firstStopTime = stopTimesForTrip[0].departure_time;
    //On récupère le tout dernier horaire de passage
    const lastStopTime = stopTimesForTrip[stopTimesForTrip.length - 1].arrival_time;

    //On convertit les horaires (sous formes HH:MM:SS) en format Date
    const firstDate = new Date(`01/01/1970 ${firstStopTime}`);
    const lastDate = new Date(`01/01/1970 ${lastStopTime}`);

    //On calcule la durée du voyagen, et on le convertit en minutes
    const duration = (lastDate - firstDate) / 1000 / 60;

    return {
        trip_id: tripId,
        duration: duration,
        unit: 'minutes'
    }
}

function getLinesThroughStop(stopId) { //On récupère les lignes passant par un arrêt
    const lines = [];
    const trips = allTrips.filter(trip => {
        const stops = getStopsForTrip(trip.trip_id);
        return stops.includes(stopId);
    });

    trips.forEach(trip => {
        if (!lines.includes(trip.route_id)) {
            lines.push(trip.route_id);
        }
    });

    return lines;
}

function getRouteInfos(routeId) { //On récupère les informations d'une ligne
    const routeInfos = routes.find(route => route.route_id === routeId);

    return routeInfos;
}


function getNextBusesStop(stopId) { //On récupère les prochains bus à un arrêt
    // Votre logique pour obtenir les prochains bus à un arrêt va ici...
}
  
module.exports = {
    getLinesThroughStop,
    getNextBusesStop,
    getStopsForTrip,
    getStopsInfos,
    getTripsDuration,
    getRouteInfos
};