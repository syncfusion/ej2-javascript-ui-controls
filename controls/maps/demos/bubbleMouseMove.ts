/**
 * Bubble sample
 */
import { population, internetUsers } from './MapData/Populationdata';
import { world_Map } from './MapData/worldMap';
import { Maps, Bubble, IBubbleMoveEventArgs, MapsTooltip, MapsTheme, ILoadEventArgs, Zoom, MapAjax } from '../src/index';
Maps.Inject(Bubble, MapsTooltip, Zoom);
export interface Data {
    value?: number;
}
let count: number = 0;

let maps: Maps = new Maps({
    bubbleMouseMove: (args: IBubbleMoveEventArgs) => {
        if (count === 0) {
            maps.titleSettings.text = 'Bubble Mouse Move Event';
			maps.refresh();
			count++;
        }
    },
    format: 'n',
    useGroupingSeparator: true,
    zoomSettings: {
        enable: true,
        horizontalAlignment: 'Near',
        toolBarOrientation: 'Vertical',
        pinchZooming: true
    },
    titleSettings: {
        text: 'Top 30 countries with highest Internet users',
        textStyle: {
            size: '16px'
        }
    },
    layers: [
        {
            shapeDataPath: 'name',
            shapePropertyPath: 'name',
            shapeData: world_Map,
            shapeSettings: {
                fill: '#E5E5E5'
            },
            bubbleSettings: [
                {
                    visible: true,
                    valuePath: 'value',
                    colorValuePath: 'color',
                    animationDuration: 0,
                    minRadius: 3,
                    maxRadius: 70,
                    opacity: 0.8,
                    dataSource: internetUsers,
                    tooltipSettings: {
                        visible: true,
                        valuePath: 'population',
                        template: '#template'
                    },
                }
            ]
        }
    ]
});
maps.appendTo('#container');