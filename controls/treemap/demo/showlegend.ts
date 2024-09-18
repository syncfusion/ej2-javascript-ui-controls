import { TreeMap } from '../src/treemap/treemap';
import { TreeMapHighlight, TreeMapSelection } from '../src/treemap/user-interaction/highlight-selection';
import { TreeMapTooltip } from '../src/treemap/user-interaction/tooltip';
import { TreeMapLegend } from '../src/treemap/layout/legend';
import { DrillDown } from '../demo/Data/Drilldown_Sample';
import { Browser } from '@syncfusion/ej2-base';
import { electionData } from './treemapData/Election_data';
import{ LegendMode }  from '../src/treemap/utils/enum';
TreeMap.Inject(TreeMapTooltip, TreeMapLegend);

/**
 * Default sample
 */

let prevTime: Date; let curTime: Date;
let treemap: TreeMap = new TreeMap({
    titleSettings: {
        text: 'US Presidential election result - 2016',
        textStyle: { size: '15px' }
    },
    dataSource: electionData,
    weightValuePath: 'Population',
    tooltipSettings: {
        visible: true,
        format: ' <b>${Winner}<b><br>State : ${State}<br>Trump : ${Trump} %<br>Clinton : ${Clinton} %'
    },
    legendSettings: {
        visible: false,
        mode:'Interactive',
        position: 'Top',
        shape: 'Rectangle',
        height: '10'
    },
    format: 'n',
    useGroupingSeparator: true,
    rangeColorValuePath: 'WinPercentage',
    equalColorValuePath: 'Winner',
    leafItemSettings: {
        labelPath: 'State',
        fill: '#6699cc',
        border: { color: 'white', width: 0.5 },
        colorMapping: [
            {
                value: 'Trump', color: '#D84444'
            },
            {
                value: 'Clinton', color: '#316DB5'
            }
        ]
    },
});
treemap.appendTo('#container');
