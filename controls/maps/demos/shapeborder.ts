/**
 * Maps default sample
 */
import { Maps, Legend, Marker, MapsTooltip, ILoadEventArgs, MapsTheme, MapAjax } from '../src/index';
import { dafaultData } from './MapData/salesCountry';
import { world_Map } from './MapData/worldMap';

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
                shapeData: world_Map,
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
