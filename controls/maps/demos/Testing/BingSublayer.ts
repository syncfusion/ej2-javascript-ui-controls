import { Maps, Legend, Marker, MapsTooltip, ILoadEventArgs, MapsTheme, MapAjax, Zoom, MarkerType } from '../../src/index';
import { dafaultData } from '../MapData/salesCountry';
import { world_Map } from '../MapData/worldMap';
import { africa } from '../MapData/africa';

Maps.Inject(Legend, Marker, MapsTooltip, Zoom);
//tslint:disable:max-func-body-length
    let maps: Maps = new Maps({
        titleSettings: {
            text: 'Location of Africa continent in the World map',
            textStyle: {
                size: '16px'
            }
        },
        zoomSettings: {
            enable: true
        },
        layers: [{
            layerType: 'Bing',
            key: 'AuQazZ3PUo3p2_c2KPhqMku-iKvee5fKcRREIg46MENqVTM9dp2ZyTbrHJpR9esZ'
        },
        {
            type: 'SubLayer',
            animationDuration: 0,
            shapeData: africa,
            shapeSettings: {
                fill: '#5100a3',
                opacity: 0.4
            }
        }]
    });
    maps.appendTo('#container');

