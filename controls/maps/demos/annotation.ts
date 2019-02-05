/**
 * Maps Annotation
 */
import { Maps, Annotations, Marker, MapsTheme, ILoadEventArgs, MapAjax } from '../src/index';

Maps.Inject(Annotations, Marker);

    let maps: Maps = new Maps({
        zoomSettings: {
            enable: false
        },
        annotations: [
            {
                content: '#maps-annotation',
                x: '0%', y: '50%'
            }, {
                content: '#compass-maps',
                x: '80%', y: '5%'
            }
        ],
        layers: [
            {
                shapeDataPath: 'name',
                shapePropertyPath: 'name',
                shapeData: new MapAjax('http://npmci.syncfusion.com/development/demos/src/maps/MapData/Africa_Continent.json'),
                shapeSettings: {
                    fill: 'url(#grad1)'
                },
                markerSettings: [
                    {
                        visible: true,
                        template: '<h3 style="color:white">{{:name}}</h3>',
                        animationDuration: 1,
                        dataSource: [{
                            name: 'Africa', latitude: 13.97274101999902, longitude: 20.390625
                        }]
                    }
                ]
            }
        ]
    });
    maps.appendTo('#maps');