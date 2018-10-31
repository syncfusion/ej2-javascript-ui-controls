/**
 * Maps default sample
 */
import { Maps, Legend, Marker, MapsTooltip, ILoadEventArgs, MapsTheme, MapAjax } from '../src/index';
import { dafaultData } from './MapData/salesCountry';

Maps.Inject(Legend, Marker, MapsTooltip);
//tslint:disable:max-func-body-length
    let maps: Maps = new Maps({
        titleSettings: {
            text: 'YouTube office locations',
            textStyle: {
                size: '16px'
            }
        },
        margin:{
            left:30,
            right:30
        },
        zoomSettings: {
            enable: false
        },
        layers: [
            {
                shapeData:new MapAjax('http://npmci.syncfusion.com/development/demos/src/maps/MapData/WorldMap.json'),
                shapePropertyPath: 'continent',
                shapeDataPath: 'continent',
                shapeSettings:{
                    fill:'blue'
                }
            },
        ],
       
    });
    maps.appendTo('#container');
