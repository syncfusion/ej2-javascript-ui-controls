import { TreeMap } from '../src/treemap/treemap';
import { TreeMapHighlight, TreeMapSelection } from '../src/treemap/user-interaction/highlight-selection';
import { TreeMapTooltip } from '../src/treemap/user-interaction/tooltip';
import { TreeMapLegend } from '../src/treemap/layout/legend';
import { DrillDown } from '../demo/Data/Drilldown_Sample';
import { Metals } from './treemapData/metals';
import { Browser } from '@syncfusion/ej2-base';
import { importData } from './treemapData/Import';
import{ IItemHighlightEventArgs } from '../src/treemap/model/interface';
TreeMap.Inject(TreeMapTooltip, TreeMapHighlight);

/**
 * Default sample
 */
let count: number = 0;
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
    highlightSettings: {
        enable: true,
        fill: '#71b0dd',
        border: { width: 0.3, color: 'black' },
        opacity: '1'
    },
    itemHighlight: (args: IItemHighlightEventArgs)=> {
        if (count === 0) {
            let span = document.createElement("SPAN");
            span.innerHTML = "itemHighlight Event";
            span.setAttribute("style", "font-size: 30px");
            let container = document.getElementById("container");
            container.appendChild(span);
            count++;
          }
    }
});
treemap.appendTo('#container');