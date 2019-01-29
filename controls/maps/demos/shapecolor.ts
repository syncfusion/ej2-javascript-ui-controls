/**
 * Maps default sample
 */
import { Maps, Legend, Marker, MapsTooltip, ILoadEventArgs, MapsTheme, MapAjax } from '../src/index';
import { dafaultData } from './MapData/salesCountry';
import { world_Map } from './MapData/worldMap';

Maps.Inject(Legend, Marker, MapsTooltip);
//tslint:disable:max-func-body-length
    let maps: Maps = new Maps({
        titleSettings: {
            text: 'YouTube office locations',
            textStyle: {
                size: '16px'
            }
        },
        border:{
            color:'red',
            width:2
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
                    fill: 'red'
                }
            },
        ],
       
    });
    maps.appendTo('#container');
