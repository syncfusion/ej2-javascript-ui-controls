/**
 * Multi-layer map sample
 */
import { Maps, Marker, ILoadEventArgs, MapsTheme, MapsTooltip, DataLabel, ZoomSettings, Zoom, MapAjax } from '../src/index';
import {usa } from './MapData/USA';
import {california} from './MapData/california';
import {texas } from './MapData/texas';
Maps.Inject(Marker, MapsTooltip, DataLabel,Zoom);
//tslint:disable:max-func-body-length
    let maps: Maps = new Maps({
        zoomSettings: {
            enable: true,
            pinchZooming: true
        },
        titleSettings: {
            text: 'Samsung Semiconductor office locations in USA',
            textStyle: {
                size: '16px'
            }
        },
        layers: [
            {
                shapeData: usa,
                shapeSettings: {
                    fill: '#E5E5E5',
                    border: {
                        color: 'black',
                        width: 0.1
                    }
                },
                dataLabelSettings: {
                    visible: true,
                    labelPath: 'iso_3166_2',
                    smartLabelMode: 'Hide'
                }
            },
            {
                shapeData: texas,
                type: 'SubLayer',
                shapeSettings: {
                    fill: 'rgba(141, 206, 255, 0.6)',
                    border: {
                        color: '#1a9cff',
                        width: 0.25
                    }
                },
                markerSettings: [
                    {
                        visible: true,
                        width: 20,
                        height: 20,
                        template: '#markercircle',
                        dataSource: [
                            {
                                latitude: 30.267153,
                                longitude: -97.7430608,
                                name: 'Austin'
                            }
                        ],
                        tooltipSettings: {
                            visible: true,
                            valuePath: 'name',
                            format: '<b>${name}</b><br>Manufacturing Center,<br>Research and Development Center'
                        }
                    },
                    {
                        visible: true,
                        dataSource: [
                            {
                                latitude: 31.80289258670676,
                                longitude: -98.96484375
                            }
                        ],
                        template: '<div style="color:black;">TX</div>'
                    }
                ]
            },
            {
                shapeData: california,
                type: 'SubLayer',
                shapeSettings: {
                    fill: 'rgba(141, 206, 255, 0.6)',
                    border: {
                        color: '#1a9cff',
                        width: 0.25
                    }
                },
                markerSettings: [
                    {
                        visible: true,
                        width: 20,
                        height: 20,
                        dataSource: [
                            {
                                latitude: 37.3382082,
                                longitude: -121.8863286,
                                name: 'San Jose'
                            }
                        ],
                        tooltipSettings: {
                            visible: true,
                            valuePath: 'name',
                            format: '<b>${name}</b><br>Regional Office,<br>Research and Development Center'
                        },
                        template: '#markercircle'
                    },
                    {
                        visible: true,
                        dataSource: [
                            {
                                latitude: 37.09023980307208,
                                longitude: -119.35546875000001
                            }
                        ],
                        template: '<div style="color:black;">CA</div>'
                    }
                ]
            }
        ]
    });
    maps.appendTo('#container');