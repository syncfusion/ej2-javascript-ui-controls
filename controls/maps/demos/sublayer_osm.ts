/**
 * Maps Annotation
 */
import { Maps, Annotations, Marker, MapsTheme, ILoadEventArgs, MapAjax } from '../src/index';
import {Africa_Continent } from './MapData/Africa_Continent';
Maps.Inject(Annotations, Marker);

    let maps: Maps = new Maps({
        zoomSettings: {
            enable: false
        },
        layers: [
            {
                layerType: 'OSM',
                //bingMapType: 'AerialWithLabel',
            },
            {
                type: 'SubLayer',
                animationDuration: 0,
                shapeData: Africa_Continent,
                shapeSettings: {
                    fill: '#5100a3',
                    opacity: 0.5
                }
            }
        ]
    });
    maps.appendTo('#container');