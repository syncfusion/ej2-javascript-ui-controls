import { TreeMap } from '../src/treemap/treemap';
import { TreeMapHighlight, TreeMapSelection } from '../src/treemap/user-interaction/highlight-selection';
import { TreeMapTooltip } from '../src/treemap/user-interaction/tooltip';
import { TreeMapLegend } from '../src/treemap/layout/legend';
import { DrillDown } from '../demo/Data/Drilldown_Sample';
import { Metals } from './treemapData/metals';
import { Browser } from '@syncfusion/ej2-base';
import { importData } from './treemapData/Import';
TreeMap.Inject(TreeMapTooltip, TreeMapSelection);

/**
 * Default sample
 */

let prevTime: Date; let curTime: Date;
let treemap: TreeMap = new TreeMap({
    titleSettings: {
        text: 'Import and Export details of US'
    },
    dataSource: importData,
    weightValuePath: 'sales',
    levels: [
        { groupPath: 'dataType', fill: '#c5e2f7', headerStyle: { size: '16px' }, headerAlignment: 'Center', groupGap: 5 },
        { groupPath: 'product', fill: '#a4d1f2', headerAlignment: 'Center' , groupGap: 2 }
    ],
    leafItemSettings: {
        labelPath: 'type',
        fill: '#8ebfe2',
        labelPosition: 'Center',
        gap: 10
    },
    selectionSettings: {
        enable: true,
        fill: '#58a0d3',
        border: { width: 0.3, color: 'black' },
        opacity: '1'
    }
});
treemap.appendTo('#container');