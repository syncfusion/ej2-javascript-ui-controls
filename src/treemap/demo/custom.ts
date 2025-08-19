import { TreeMap } from '../src/treemap/treemap';
import { TreeMapHighlight, TreeMapSelection } from '../src/treemap/user-interaction/highlight-selection';
import { TreeMapTooltip } from '../src/treemap/user-interaction/tooltip';
import { TreeMapLegend } from '../src/treemap/layout/legend';
import { DrillDown } from '../demo/Data/Drilldown_Sample';
import { Metals } from './treemapData/metals';
import { Browser } from '@syncfusion/ej2-base';
TreeMap.Inject(TreeMapTooltip);

/**
 * Default sample
 */

let prevTime: Date; let curTime: Date;
let treemap: TreeMap = new TreeMap({
    // To config Title for treemap 
    titleSettings: {
        text: 'US Gold medal categories in Summer Olympics - 2016',
        textStyle: {size: '15px'}
    },
    //enableDrillDown: true,
    dataSource: Metals,
    weightValuePath: 'Gold',
    // To config tooltip for treemap 
    tooltipSettings: {
        visible: true,
        format: '${Sport} : ${Gold}'
    },
    // To config leaf items for treemap
    leafItemSettings: {
        showLabels: !Browser.isDevice,
        labelPath: 'Sport',
        fill: '#993399',
        templatePosition: 'Center',
        border: { color: 'black', width: 0.5 },
        labelFormat: ' ${Sport} - ${Gold}',
        labelTemplate: '<div style="pointer-events: none;"><img src="../Demo/images/{{:GameImage}}"' +
        ' style="height:{{:ItemHeight}};width:{{:ItemWidth}};"></img></div>'
    }
});
treemap.appendTo('#container');


