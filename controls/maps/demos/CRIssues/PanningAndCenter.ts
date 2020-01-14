/**
 * Maps zooming sample
 */
import { Maps, Zoom, MarkerSettings, IMouseEventArgs, MarkerSettingsModel ,Marker} from '../../src/index';
import { randomcountriesData } from '../MapData/salesCountry';
import { world_Map } from '../MapData/worldMap';
Maps.Inject(Zoom, Marker);

    let maps: Maps = new Maps({
    zoomSettings: {
        enable: true,
        toolbars: ['Zoom', 'ZoomIn', 'ZoomOut', 'Pan', 'Reset'],
        pinchZooming: true,
		shouldZoomInitially:true   
    },
    titleSettings:{
        text:'AddTheTitleInShouldZoomInitiallyMapIsNotAlignedCenter'
    },
    layers: [
        {
        shapeData: world_Map,
		markerSettings: [
        {
            dataSource: [
                {
                    "name": "Buenos Aires",
                    "latitude": -19.019585,
                    "longitude": -65.261963,
                    "Country": "Argentina",
                    "Continent": "South America"
                },
                 {
                     "name": "Brasília",
                     "latitude": -15.793889,
                     "longitude": -47.882778,
                     "Country": "Brazil",
                     "Continent": "South America"
                 },
                 {
                     "name": "Santiago",
                     "latitude": -33.447487,
                     "longitude": -70.673676,
                     "Country": "Chile",
                     "Continent": "South America"
                 },
                 {
                     "name": "Bogota",
                     "latitude": 4.624335,
                     "longitude": -74.063644,
                     "Country": "Colombia",
                     "Continent": "South America"
                 },
                 {
                     "name": "Quito",
                     "latitude": -0.180653,
                     "longitude": -78.467834,
                     "Country": "Ecuador",
                     "Continent": "South America"
                 },
                 {
                     "name": "Georgetown",
                     "latitude": 6.8045,
                     "longitude": -58.1553,
                     "Country": "Guyana",
                     "Continent": "South America"
                 },
                 {
                     "name": "Asuncion",
                     "latitude": -25.3006592,
                     "longitude": -57.63591,
                     "Country": "Paraguay",
                     "Continent": "South America"
                 },
                 {
                     "name": "Lima",
                     "latitude": -12.046374,
                     "longitude": -77.042793,
                     "Country": "Peru",
                     "Continent": "South America"
                 },
                 {
                     "name": "Paramaribo",
                     "latitude":  5.8663802,
                     "longitude": -55.1668205,
                     "Country": "Suriname",
                     "Continent": "South America"
                 },
                 {
                     "name": "Montevideo",
                     "latitude": -34.901112,
                     "longitude": -56.164532,
                     "Country": "Uruguay",
                     "Continent": "South America"
                 },
                 {
                     "name": "Caracas",
                     "latitude": 10.500000,
                     "longitude": -66.916664,
                     "Country": "Vanezuela",
                     "Continent": "South America"
                 },
                 {
                     "name": "Cayenne",
                     "latitude": 4.937200,
                     "longitude": -52.326000,
                     "Country": "French Guiana",
                     "Continent": "South America"
                 }
            ],
            visible: true,
            animationDuration: 0,
            shape: 'Circle',
            fill: 'white',
            width: 3,
            border: { width: 2, color: '#285255' },
        }]
    }]
    });
    maps.appendTo('#mapszooming');
   
    