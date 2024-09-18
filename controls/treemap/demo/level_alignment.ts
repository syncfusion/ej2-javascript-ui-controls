import { TreeMap } from '../src/treemap/treemap';
import { TreeMapHighlight, TreeMapSelection } from '../src/treemap/user-interaction/highlight-selection';
import { TreeMapTooltip } from '../src/treemap/user-interaction/tooltip';
import { TreeMapLegend } from '../src/treemap/layout/legend';
import { DrillDown } from '../demo/Data/Drilldown_Sample';
import { Metals } from './treemapData/metals';
import { Browser } from '@syncfusion/ej2-base';
import { importData } from './treemapData/Import';
import { Alignment} from '../src/treemap/utils/enum';
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
        { groupPath: 'dataType',  headerAlignment: 'Center', groupGap: 5 },
        { groupPath: 'product',  headerAlignment: 'Center' , groupGap: 2 }
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
document.getElementById('labels').onchange =() =>{
    var value = (<HTMLInputElement>document.getElementById('labels')).value;
    treemap.levels[1].headerAlignment =<Alignment>value;
    treemap.refresh();
}