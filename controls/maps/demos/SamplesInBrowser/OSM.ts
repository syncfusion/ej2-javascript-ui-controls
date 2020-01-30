import { Maps, Legend, Marker, MapsTooltip, ILoadEventArgs, MapsTheme, MapAjax, Zoom, MarkerType } from '../../src/index';
import { dafaultData } from '../MapData/salesCountry';
import { world_Map } from '../MapData/worldMap';

Maps.Inject(Legend, Marker, MapsTooltip, Zoom);
//tslint:disable:max-func-body-length
    let maps: Maps = new Maps({
        titleSettings: {
            text: 'Headquarters of the United Nations',
            textStyle: {
                size: '16px'
            }
        },
        centerPosition: {
            latitude: 40.7209,
            longitude: -73.9680
        },
        zoomSettings: {
            zoomFactor: 10,
            enable: false
        },
        layers: [{
            layerType: 'OSM',
            animationDuration: 0,
            markerSettings: [
                {
                    visible: true,
                    template: '<div><img src="../images/ballon.png" style="height:30px;width:20px;"></img></div>',
                    dataSource: [{
                        name: 'Manhattan, New York, USA',
                        latitude: 40.7488758,
                        longitude: -73.9730091
                    }],
                    tooltipSettings: {
                        visible: true,
                        valuePath: 'name'
                    }
                }
            ]
        }]
    });
    maps.appendTo('#container');

