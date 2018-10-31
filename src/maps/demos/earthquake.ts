/**
 * Earth quake map sample
 */
import { Maps, Zoom, Marker, ILoadEventArgs, MapsTheme, MapAjax } from '../src/index';

Maps.Inject(Zoom, Marker);

    let maps: Maps = new Maps({
        centerPosition: {
            latitude: 1.5053645409602877,
            longitude: 105.14038085937499
        },
        zoomSettings: {
            enable: false,
            zoomFactor: 7,
        },
        mapsArea: {
            background: '#AEE2FA'
        },
        titleSettings: {
            text: '7.6 Magnitude earthquake strikes Sumatra - 2009',
            textStyle: {
                size: '18px'
            }
        },
        layers: [
            {
                shapeDataPath: 'name',
                shapePropertyPath: 'name',
                shapeData: new MapAjax('http://npmci.syncfusion.com/development/demos/src/maps/MapData/Asia.json'),
                markerSettings: [{
                    visible: true,
                    height: 100,
                    width: 100,
                    template: '#template',
                    animationDuration: 0,
                    dataSource: [{
                        latitude: 1.625758360412755, longitude: 98.5693359375
                        }]
                }],
                shapeSettings: {
                    fill: '#FFFDCF',
                    border: {
                        color: '#3497C3 ',
                        width: 0.5
                    }
                },
                dataLabelSettings: {
                    visible: true,
                    labelPath: 'name',
                    smartLabelMode: 'Hide'
                }
            }
        ]
    });
    maps.appendTo('#maps');