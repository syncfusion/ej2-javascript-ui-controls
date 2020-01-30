import { Maps, Legend, Marker, MapsTooltip, ILoadEventArgs, NavigationLine, MapsTheme, MapAjax, Zoom, MarkerType } from '../../src/index';
import { dafaultData } from '../MapData/salesCountry';
import { world_Map } from '../MapData/worldMap';
import { africa } from '../MapData/africa';

Maps.Inject(Legend, Marker, MapsTooltip, NavigationLine, Zoom);
//tslint:disable:max-func-body-length
    let maps: Maps = new Maps({
        titleSettings: {
            text: 'Flight route from Los Angeles to Mexico city',
            textStyle: {
                size: '16px'
            }
        },
        zoomSettings: {
            zoomFactor: 5,
            enable: false
        },
        centerPosition: {
            latitude: 27.0902,
            longitude: -105.7129
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
        layers: [
            {
                layerType: 'Bing',
                key: 'AuQazZ3PUo3p2_c2KPhqMku-iKvee5fKcRREIg46MENqVTM9dp2ZyTbrHJpR9esZ',
                markerSettings: [
                    {
                        visible: true,
                        template: '<div><img src="../images/group.svg" style="height:15px;width:15px;"></img></div>',
                        dataSource: [{
                                name: 'Mexico City',
                                latitude: 23.6445,
                                longitude: -102.832
                            }],
                        tooltipSettings: {
                            visible: true,
                            valuePath: 'name'
                        }
                    },
                    {
                        visible: true,
                        template: '<div><img src="../images/ballon.png" style="height:30px;width:20px;"></img></div>',
                        dataSource: [{
                                name: 'Mexico City',
                                latitude: 24.2005,
                                longitude: -102.832
                            }],
                        tooltipSettings: {
                            visible: true,
                            valuePath: 'name'
                        }
                    },
                    {
                        visible: true,
                        template: '<div style= "font-weight:500; font-size: 13px; text-align: left">Mexico</div>',
                        dataSource: [{
                                name: 'Mexico City',
                                latitude: 24.0005,
                                longitude: -101.200
                            }],
                    },
                    {
                        visible: true,
                        template: '<div><img src="../images/oval.svg" style="height:15px;width:15px;"></img></div>',
                        dataSource: [{
                                name: 'Los Angeles',
                                latitude: 34.0522,
                                longitude: -118.2437
                            }],
                        tooltipSettings: {
                            visible: true,
                            valuePath: 'name'
                        }
                    },
                    {
                        visible: true,
                        template: '<div><div style="text-align: right; font-weight:500; font-size: 13px;">Los Angeles</br>' +
                        'International Airport</div></div>',
                        dataSource: [{
                                name: 'Los Angeles City',
                                latitude: 34.7000,
                                longitude: -121.5000
                            }],
                    },
                    {
                        visible: true,
                        template: '<div><img src="../images/map-tooltip.svg" style="height:50px;width:100px;"></img></div>',
                        dataSource: [{
                                latitude: 28.5,
                                longitude: -110.400
                            }],
                    }
                ],
                navigationLineSettings: [{
                        width: 8,
                        visible: true,
                        angle: -0.05,
                        color: '#00ace6',
                        latitude: [23.6445, 34.0522],
                        longitude: [-102.832, -118.2437]
                    }]
            }
        ]
    });
    maps.appendTo('#container');

