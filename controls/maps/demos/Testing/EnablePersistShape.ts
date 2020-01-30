/**
 * Maps zooming sample
 */
import { Maps, Zoom, ILoadEventArgs, MapsTheme, MapAjax } from '../../src/index';
import { randomcountriesData } from '../MapData/salesCountry';
import { world_Map } from '../MapData/worldMap';
Maps.Inject(Zoom);

    let maps: Maps = new Maps({
        enablePersistence: true,
        zoomSettings: {
            enable: true,
            toolbars: ['Zoom', 'ZoomIn', 'ZoomOut', 'Pan', 'Reset'],
            pinchZooming: true
        },
        layers: [
            {
                shapeData: world_Map,
                shapePropertyPath: 'continent',
                shapeDataPath: 'continent',
                shapeSettings: {
                autofill: true,
                colorValuePath: 'color'
            },
            dataSource: randomcountriesData
        }
    ]
    });
    maps.appendTo('#container');