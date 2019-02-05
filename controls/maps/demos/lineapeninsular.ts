/**
 * Linea penusular sample
 */
import { Maps, Marker, Zoom, NavigationLine, ILoadEventArgs, MapsTheme, MapAjax } from '../src/index';
import { penisular_location, penisular_marker } from './MapData/MapLocation';

Maps.Inject(Marker, Zoom, NavigationLine);
//tslint:disable:max-func-body-length
    let maps: Maps = new Maps({
        titleSettings: {
            text: 'Shipping sea route between various cities',
            textStyle: {
                size: '18px'
            }
        },
        zoomSettings: {
            enable: false,
            zoomFactor: 13
        },
        mapsArea: {
            background: '#4863A0'
        },
        centerPosition: {
            latitude: 25.54244147012483,
            longitude: -89.62646484375
        },
        layers: [
            {
                shapeData: new MapAjax('http://npmci.syncfusion.com/development/demos/src/maps/MapData/WorldMap.json'),
                shapeSettings: {
                    fill: '#789071',
                },
                navigationLineSettings: penisular_location,
                markerSettings: [
                    {
                        visible: true,
                        shape: 'Circle',
                        fill: 'white',
                        width: 10,
                        height: 10,
                        dataSource: penisular_marker
                    },
                    {
                        visible: true,
                        template: '<div id="marker1" style="font-size: 12px;color:white">ALTAMIRA' +
                            '</div>',
                        dataSource: [
                            { latitude: 22.403410892712124, longitude: -97.8717041015625, }
                        ],
                        animationDuration: 0,
                        offset: {
                            x: -35,
                            y: 0
                        }
                    },
                    {
                        visible: true,
                        template: '<div id="marker2" style="font-size: 12px;color:white">HOUSTON' +
                            '</div>',
                        dataSource: [
                            { latitude: 29.756032197482973, longitude: -95.36270141601562 }
                        ],
                        animationDuration: 0,
                        offset: {
                            x: 0,
                            y: -15
                        }
                    },
                    {
                        visible: true,
                        template: '<div id="marker3" style="font-size: 12px;color:white">PANAMA CITY' +
                            '</div>',
                        dataSource: [
                            { latitude: 30.180747605060766, longitude: -85.81283569335938 }
                        ],
                        animationDuration: 0,
                        offset: {
                            x: 0,
                            y: -5
                        }
                    },
                    {
                        visible: true,
                        template: '<div id="marker4" style="font-size: 12px;color:white">TAMPA' +
                            '</div>',
                        dataSource: [
                            { latitude: 27.9337540167772, longitude: -82.49908447265625 }
                        ],
                        animationDuration: 0,
                        offset: {
                            x: 0,
                            y: -15
                        }
                    },
                    {
                        visible: true,
                        template: '<div id="marker5" style="font-size: 12px;color:white">PROGRESO' +
                            '</div>',
                        dataSource: [
                            { latitude: 21.282336521195344, longitude: -89.6649169921875 }
                        ],
                        animationDuration: 0,
                        offset: {
                            x: 0,
                            y: 15
                        }
                    }
                ]
            }
        ]
    });
    maps.appendTo('#container');
