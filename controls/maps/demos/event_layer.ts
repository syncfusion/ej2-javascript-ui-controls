/**
 * Changing projection sample
 */

import { Maps, Zoom, Legend, ProjectionType, ILayerRenderingEventArgs, MapsTooltip, ILoadEventArgs, MapsTheme, MapAjax } from '../src/index';
import { unCountries } from './MapData/UNOCountries';
import { world_Map } from './MapData/worldMap';

Maps.Inject(Zoom, Legend, MapsTooltip);

let maps: Maps = new Maps({
    layerRendering: (args: ILayerRenderingEventArgs) => {
        args.layer.layerType = 'OSM';
    },
     titleSettings: {
        text: 'Members of the UN Security Council',
        textStyle: {
            size: '16px'
        },
        subtitleSettings: {
            text: '- In 2017',
            alignment: 'Far'
        }
    },
    legendSettings: {
        visible: true
    },
    zoomSettings: {
        enable: false
    },
    layers: [
        {
            shapeData: world_Map,
            shapeDataPath: 'Country',
            shapePropertyPath: 'name',
            dataSource : unCountries,
            tooltipSettings: {
                visible: true,
                valuePath: 'Country',
            },
            shapeSettings: {
                fill: '#E5E5E5',
                colorMapping: [
                    {
                        value: 'Permanent',
                        color: '#EDB46F'
                    },
                    {
                        color: '#F1931B',
                        value: 'Non-Permanent'
                    }
                ],
                colorValuePath: 'Membership'
            }
        }
    ]
});
maps.appendTo('#container');
