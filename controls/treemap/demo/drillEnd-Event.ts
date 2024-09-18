import { TreeMap } from '../src/treemap/treemap';
import { TreeMapTooltip } from '../src/treemap/user-interaction/tooltip';
import { DrillDown } from '../demo/Data/Drilldown_Sample';
import { EmitType } from '@syncfusion/ej2-base';
import{ IDrillStartEventArgs } from '../src/treemap/model/interface';
import{ IDrillEndEventArgs } from '../src/treemap/model/interface';
TreeMap.Inject(TreeMapTooltip);

/**
 * Default sample
 */

let count: number = 0;
let prevTime: Date; let curTime: Date;
let treemap: TreeMap = new TreeMap({
    palette: ['#9999ff', '#CCFF99', '#FFFF99', '#FF9999', '#FF99FF', '#FFCC66'],
    titleSettings: {
        text: 'List of countries by population',
        textStyle: { size: '15px' }
    },
    enableDrillDown: true,
    format: 'n',
    useGroupingSeparator: true,
    dataSource: DrillDown,
    weightValuePath: 'Population',
    leafItemSettings: {
        labelPath: 'Name',
        showLabels: false,
        labelStyle: { size: '0px' },
        border: { color: 'black', width: 0.5 }
    },
    levels: [
        { groupPath: 'Continent', fill: '#336699', border: { color: 'black', width: 0.5 } },
        { groupPath: 'States', fill: '#336699', border: { color: 'black', width: 0.5 } },
        { groupPath: 'Region', showHeader: false, fill: '#336699', border: { color: 'black', width: 0.5 } },
    ],
    drillEnd: (args: IDrillEndEventArgs) => {
        if (count === 0) {
            treemap.titleSettings.text = 'Drill End Event';
			treemap.refresh();
			count++;
          }
    }
});
treemap.appendTo('#container');


