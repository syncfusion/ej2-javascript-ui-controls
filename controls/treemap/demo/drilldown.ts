import { TreeMap } from '../src/treemap/treemap';
import { TreeMapTooltip } from '../src/treemap/user-interaction/tooltip';
import { DrillDown } from '../demo/Data/Drilldown_Sample';
TreeMap.Inject(TreeMapTooltip);

/**
 * Default sample
 */

let prevTime: Date; let curTime: Date;
let treemap: TreeMap = new TreeMap({
   /* drillStart: (args: IDrillStartEventArgs) => {
        if (args.item[Object.keys(args.item)[0]].length === 1) {
            args.treemap.levels[2].showHeader = true;
        } else {
            args.treemap.levels[2].showHeader = false;
        }
    },
    tooltipRendering: (args: ITreeMapTooltipRenderEventArgs) => {
        //tslint:disable-next-line
        if (args.item['groupIndex'] !== 2 ) {
            args.cancel = true;
        }
    },*/
    //load: treemapload,
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
    tooltipSettings: {
        visible: true,
        format: '${Name} : ${Population}'
    },
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
    ]
});
treemap.appendTo('#container');


