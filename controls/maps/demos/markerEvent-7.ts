/**
 * Marker sample
 */
import { Maps, Marker, MapsTooltip, IMarkerRenderingEventArgs, ILoadEventArgs, MapsTheme, MapAjax } from '../src/index';
import { topPopulation } from './MapData/MarkerLocation';
import { world_Map } from './MapData/worldMap';
Maps.Inject(Marker, MapsTooltip);

let maps: Maps = new Maps({
    markerRendering: (args: IMarkerRenderingEventArgs) => {
        if (args.data['name'] === 'Los Angeles') {
            args.template = '<div>Event</div>'
          }
    },
    useGroupingSeparator: true,
    format: 'n',
    zoomSettings: {
        enable: false
    },
    titleSettings: {
        text: 'Top 25 populated cities in the world',
        textStyle: {
            size: '16px'
        }
    },
    layers: [
        {
            shapeData: world_Map,
            dataSource: topPopulation,
            shapeSettings: {
                fill: '#C3E6ED'
            },
            markerSettings: [
                {
                    dataSource: topPopulation,
                    visible: true,
                    animationDuration: 0,
                    shape: 'Circle',
                },
            ]
        }
    ]
});
maps.appendTo('#container');