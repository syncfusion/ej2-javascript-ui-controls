/**
 * Multi-layer map sample
 */
import { Maps, Marker, ILoadEventArgs, MapsTheme, MapsTooltip, DataLabel, ZoomSettings, Zoom, MapAjax, NavigationLine, Bubble } from '../src/index';
import{ India } from './MapData/India';
import { range } from './MapData/Populationdata';
Maps.Inject(Marker, MapsTooltip, DataLabel,Zoom, NavigationLine, Bubble);
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
                shapeData: new MapAjax('http://npmci.syncfusion.com/development/demos/src/maps/MapData/WorldMap.json'),
                shapeDataPath:'',
                shapePropertyPath:'',
                shapeSettings: {
                    fill: '#E5E5E5',
                    border: {
                        color: 'black',
                        width: 0.1
                    }
                },
                dataLabelSettings: {
                    visible: false,
                    labelPath: 'name',
                    smartLabelMode: 'Hide'
                }
            },
            {
                shapeData: India,
                dataSource: range,
                shapeDataPath:'name',
                shapePropertyPath:'NAME_1',
                type: 'SubLayer',
                shapeSettings: {
                    fill: 'rgba(141, 206, 255, 0.6)',
                    border: {
                        color: '#1a9cff',
                        width: 0.25
                    },
                    colorValuePath: 'population',
                    colorMapping: [
                        
                        {
                            from: 0, to: 5000, color: 'blue', label: '0-5000'
                        },
                        {
                            from: 5000, to: 11000, color: 'green', label: '5000-11000'
                        },
                        {
                            from: 11000, to: 17000, color: 'yellow', label: '11000-17000'
                        },
                        {
                            from: 17000, to: 21000, color: 'red', label: '17000-21000'
                        },
                       
                        {
                            from: 21000, to: 25000, color: 'grey', label: '21000-25000'
                        },
                        {
                            from: 25000, to: 30000, color: 'skyblue', label: '25000-30000'
                        }
                    ]
                },
            
            },
           
        ]
    });
    maps.appendTo('#container');