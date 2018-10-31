/**
 * Maps Annotation
 */
import { Maps, Annotations, Marker, MapsTheme, ILoadEventArgs, MapAjax } from '../src/index';

Maps.Inject(Annotations, Marker);

    let maps: Maps = new Maps({
        zoomSettings: {
            enable: false
        },
        layers: [
            {
                layerType: 'OSM',
                //bingMapType: 'AerialWithLabel',
            },
            {
                type: 'SubLayer',
                animationDuration: 0,
                shapeData: new MapAjax('http://npmci.syncfusion.com/development/demos/src/maps/MapData/Africa_Continent.json'),
                shapeSettings: {
                    fill: '#5100a3',
                    opacity: 0.5
                }
            }
        ]
    });
    maps.appendTo('#container');