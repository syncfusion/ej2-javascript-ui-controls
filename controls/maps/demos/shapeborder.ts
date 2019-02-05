/**
 * Maps default sample
 */
import { Maps, Legend, Marker, MapsTooltip, ILoadEventArgs, MapsTheme, MapAjax } from '../src/index';
import { dafaultData } from './MapData/salesCountry';

//tslint:disable:max-func-body-length
    let maps: Maps = new Maps({
        titleSettings: {
            text: 'YouTube office locations',
            textStyle: {
                size: '16px'
            }
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
                    fill: 'red',
                    border:{
                        width:2, color:'blue'
                    }
                }
            },
        ],
       
    });
    maps.appendTo('#container');
