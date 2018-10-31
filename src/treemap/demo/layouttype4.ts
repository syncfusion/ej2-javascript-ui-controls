import { TreeMap } from '../src/treemap/treemap';
import{LayoutMode} from '../src/treemap/utils/enum';
import { TreeMapTooltip } from '../src/treemap/user-interaction/tooltip';
import { TreeMapLegend } from '../src/treemap/layout/legend';
import { DrillDown } from '../demo/Data/Drilldown_Sample';
import { EmitType } from '@syncfusion/ej2-base';
import { econmics } from './treemapData/econmics';
TreeMap.Inject(TreeMapTooltip, TreeMapLegend);
/**
 * Default sample
 */

let prevTime: Date; let curTime: Date;
let treemap: TreeMap = new TreeMap({
    // To config title for treemap 
    titleSettings: {
        text: 'Top 10 countries by GDP Nominal - 2015',
        textStyle: {size: '15px'}
    },
    dataSource: econmics,
    weightValuePath: 'GDP',
    // To config tooltip for treemap 
    tooltipSettings: {
        visible: true,
        format: '${State}<br>Rank : ${Rank}'

    },
    rangeColorValuePath: 'GDP',
    layoutType:'SliceAndDiceAuto',
    // To config leafitem customization for treemap
    leafItemSettings: {
        labelPath: 'State',
        labelFormat: '${State}<br>$${GDP} Trillion<br>(${percentage} %)',
        labelStyle: {
            color: '#000000'
        },
        border: {
            color: '#000000',
            width: 0.5
        },
        colorMapping: [
            {
                from: 1550,
                to: 17946,
                color: '#9cbb59',
                minOpacity: 0.7,
                maxOpacity: 1,
            }
        ]
    },
});
treemap.appendTo('#container');