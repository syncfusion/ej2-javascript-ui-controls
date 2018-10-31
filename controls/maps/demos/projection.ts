/**
 * Changing projection sample
 */

import { Maps, Zoom, Legend, ProjectionType, MapsTooltip, ILoadEventArgs, MapsTheme, MapAjax } from '../src/index';
import { unCountries } from './MapData/UNOCountries';

Maps.Inject(Zoom, Legend, MapsTooltip);

let maps: Maps = new Maps({
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
            shapeData: new MapAjax('http://npmci.syncfusion.com/development/demos/src/maps/MapData/WorldMap.json'),
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

document.getElementById('projectiontype').addEventListener('change', changeProjection);
function changeProjection(): void {
     let type:any= (document.getElementById('projectiontype') as HTMLSelectElement).value;
     maps.projectionType=type;
     maps.refresh();
}
