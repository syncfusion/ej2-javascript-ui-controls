/**
 * Bubble sample
 */
import { population, internetUsers } from './MapData/Populationdata';
import { Maps, Bubble, IBubbleRenderingEventArgs, BubbleType, MapsTooltip, MapsTheme, ILoadEventArgs, Zoom, MapAjax } from  '../src/index';
import { world_Map } from './MapData/worldMap';

Maps.Inject(Bubble, MapsTooltip, Zoom);
export interface Data {
    value?: number;
}
    let maps: Maps = new Maps({
        bubbleRendering: (args: IBubbleRenderingEventArgs) => {
            args.radius = (args.data as Data).value;
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
                        animationDuration:0,
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

    document.getElementById('bubble').onchange = () => {
        let value: string = (<HTMLInputElement>document.getElementById('bubble')).value;
        maps.layers[0].bubbleSettings[0].bubbleType = <BubbleType>value; 
        maps.refresh();
    };