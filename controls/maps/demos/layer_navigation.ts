/**
 * Multi-layer map sample
 */
import { Maps, Marker, ILoadEventArgs, MapsTheme, MapsTooltip, DataLabel, ZoomSettings, Zoom, MapAjax, NavigationLine } from '../src/index';
import{ India } from './MapData/India';
Maps.Inject(Marker, MapsTooltip, DataLabel,Zoom, NavigationLine);
//tslint:disable:max-func-body-length
    let maps: Maps = new Maps({
        zoomSettings: {
            enable: false,
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
                shapeData: India,
                shapeSettings: {
                    fill: 'rgba(141, 206, 255, 0.6)',
                    border: {
                        color: '#1a9cff',
                        width: 0.25
                    }
                },
                navigationLineSettings: [
                    {
                        visible: true,
                        latitude: [20.267153, 20.756032197482973],
                        longitude: [70.7430608, 90.36270141601562],
                        angle: 0,
                        
                    }
                ]
            },
           
        ]
    });
    maps.appendTo('#container');