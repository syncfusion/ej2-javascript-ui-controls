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
            }
        ]
    });
    maps.appendTo('#container');