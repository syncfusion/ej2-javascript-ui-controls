import { Maps, Legend, Marker, MapsTooltip, ILoadEventArgs, MapsTheme, MapAjax, Zoom, MarkerType } from '../../src/index';
import { dafaultData } from '../MapData/salesCountry';
import { world_Map } from '../MapData/worldMap';
import { africa } from '../MapData/africa';

Maps.Inject(Legend, Marker, MapsTooltip, Zoom);
//tslint:disable:max-func-body-length
    let maps: Maps = new Maps({
		height: '100%',
		width: '100%',
        titleSettings: {
            text: 'Location of Africa continent in the World map',
            textStyle: {
                size: '16px'
            }
        },
        zoomSettings: {
            enable: true,
			zoomFactor: 4,
        },
        annotations: [{
            content: '<div style="height:18px;width:170px;background:white;text-align:center">' +
                '<a href="https://www.openstreetmap.org/copyright"  target = "_blank" > © OpenStreetMap contributors </a></div > ',
            verticalAlignment: 'Far',
            zIndex: '1',
            x: '-40',
            y: '-20',
            horizontalAlignment: 'Far'
        }],
        layers: [{
            layerType: 'OSM',
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

