/**
 * Marker sample
 */
import { Maps, Marker, MapsTooltip, IMarkerClickEventArgs, ILoadEventArgs, MapsTheme, MapAjax } from '../src/index';
import { topPopulation } from './MapData/MarkerLocation';
import { world_Map } from './MapData/worldMap';
Maps.Inject(Marker, MapsTooltip);

let count: number = 0;
let maps: Maps = new Maps({
    markerClick: (args: IMarkerClickEventArgs) => {
        if (count === 0) {
            maps.titleSettings.text = 'Marker Click Event';
			maps.refresh();
			count++;
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
                    fill: 'white',
                    width: 15,height: 15,
                    border: { width: 2, color: '#285255' },
                    tooltipSettings: {
                        template: '#template',
                        visible: true,
                        valuePath: 'population',
                    }
                },
            ]
        }
    ]
});
maps.appendTo('#container');