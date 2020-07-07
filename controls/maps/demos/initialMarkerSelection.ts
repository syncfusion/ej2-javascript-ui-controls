/**
 * Marker sample
 */
import { Maps, Marker, MapsTooltip, ILoadEventArgs, MapAjax, MarkerType, Selection, Zoom } from '../src/index';
import { topPopulation } from './MapData/MarkerLocation';
import { world_Map } from './MapData/worldMap';
Maps.Inject(Marker, MapsTooltip, Selection, Zoom);

    let maps: Maps = new Maps({
        useGroupingSeparator: true,
        format: 'n',
        zoomSettings: {
            enable: true
        },
        titleSettings: {
            text: 'Top 25 populated cities in the world',
            textStyle: {
                size: '16px'
            }
        },
        layers: [
            {
                shapeData: world_Map,
                dataSource: topPopulation,
                shapeSettings: {
                    fill: '#C3E6ED'
                },
                markerSettings: [
                    {
                        dataSource: topPopulation,
                        visible: true,
                        animationDuration: 0,
                        shape: 'Circle',
                        fill: 'white',
                        width: 10,
                        border: { width: 2, color: '#285255' },
                        initialMarkerSelection : [
                            {
                                latitude: 35.6894875,
                                longitude: 139.6917064,
                            }, 
                            {
                                latitude: 55.755826,
                                longitude: 37.6173,
                            },
                            {
                                latitude: 22.572646,
                                longitude: 88.363895,
                            }
                        ],
                        selectionSettings: {
                            enable: true,
                            fill: 'Green',
                            opacity: 1
                        },
                        tooltipSettings: {
                            template: '#template',
                            visible: true,
                            valuePath: 'population',
                        }
                    },
                ]
            }
        ]
    });
    maps.appendTo('#container');

    document.getElementById("shape").onchange = () => {
        var element: HTMLInputElement = <HTMLInputElement>(document.getElementById('shape'));
        if (element.checked) {
            maps.layers[0].markerSettings[0].shapeValuePath = 'shape';
        } else {
            maps.layers[0].markerSettings[0].shapeValuePath = null;
        }
        maps.refresh();
    };
    document.getElementById("color").onchange = () => {
        var element: HTMLInputElement = <HTMLInputElement>(document.getElementById('color'));
        if (element.checked) {
            maps.layers[0].markerSettings[0].colorValuePath = 'color';
        } else {
            maps.layers[0].markerSettings[0].colorValuePath = null;
        }
        maps.refresh();
    };


