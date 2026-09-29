import { TreeMap } from '../src/treemap/treemap';
import { TreeMapHighlight, TreeMapSelection } from '../src/treemap/user-interaction/highlight-selection';
import { TreeMapTooltip } from '../src/treemap/user-interaction/tooltip';
import { TreeMapLegend } from '../src/treemap/layout/legend';
import { DrillDown } from '../demo/Data/Drilldown_Sample';
import { Metals } from './treemapData/metals';
import { Browser } from '@syncfusion/ej2-base';
import { Airport_Count } from './treemapData/AirPort_Count';
TreeMap.Inject(TreeMapTooltip, TreeMapLegend);

/**
 * Default sample
 */

let prevTime: Date; let curTime: Date;
let treemap: TreeMap = new TreeMap({
    tooltipSettings: {
        visible: true,
        template: '#Tooltip'
    },
    titleSettings: {
        text: 'Country wise International Airport count in South America',
        textStyle: {
            size: '15px'
        }
    },
    dataSource: Airport_Count,
    weightValuePath: 'Count',
    equalColorValuePath: 'Count',
    legendSettings: {
        visible: true,
        position: 'Top',
        shape: 'Rectangle'
    },
    leafItemSettings: {
        showLabels: true,
        labelPath: 'State',
        labelPosition: 'Center',
        labelStyle: {
            size: '13px'
        },
        fill: '#6699cc',
        border: { width: 1, color: 'white' },
        colorMapping: [
            {
                value: 25,
                color: '#634D6F'
            },
            {
                value: 12,
                color: '#B34D6D'
            },
            {
                value: 9,
                color: '#557C5C'
            },
            {
                value: 7,
                color: '#44537F'
            },
            {
                value: 6,
                color: '#637392'
            },
            {
                value: 3,
                color: '#7C754D'
            },
            {
                value: 2,
                color: '#2E7A64'
            },
            {
                value: 1,
                color: '#95659A'
            },
        ]
    },
});
treemap.appendTo('#container');


