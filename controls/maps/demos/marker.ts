/**
 * Marker sample
 */
import { Maps, Marker, MapsTooltip, ILoadEventArgs, MapsTheme, MapAjax, MarkerType } from '../src/index';
import { topPopulation } from './MapData/MarkerLocation';
import { world_Map } from './MapData/worldMap';
Maps.Inject(Marker, MapsTooltip);

    let maps: Maps = new Maps({
        useGroupingSeparator: true,
        format: 'n',
        zoomSettings: {
            enable: false
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


