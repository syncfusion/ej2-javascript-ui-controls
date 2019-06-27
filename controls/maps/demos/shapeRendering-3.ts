/**
 * Maps default sample
 */
import { Maps, Legend, Marker, MapsTooltip, ILoadEventArgs, MapsTheme, MapAjax } from '../src/index';
import { dafaultData } from './MapData/salesCountry';
import { world_Map } from './MapData/worldMap';
import { IShapeRenderingEventArgs } from '../src/maps/model/interface';

//tslint:disable:max-func-body-length
    let maps: Maps = new Maps({
        titleSettings: {
            text: 'YouTube office locations',
            textStyle: {
                size: '16px'
            }
        },
        shapeRendering: (args: IShapeRenderingEventArgs) => {
            args.cancel = true;
        },
        layers: [
            {
                shapeData: world_Map,
                shapePropertyPath: 'continent',
                shapeDataPath: 'continent',
            },
        ],
       
    });
    maps.appendTo('#container');
