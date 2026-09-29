import { TreeMap } from '../src/treemap/treemap';
import { TreeMapHighlight, TreeMapSelection } from '../src/treemap/user-interaction/highlight-selection';
import { TreeMapTooltip } from '../src/treemap/user-interaction/tooltip';
import { TreeMapLegend } from '../src/treemap/layout/legend';
import { DrillDown } from '../demo/Data/Drilldown_Sample';
TreeMap.Inject(TreeMapTooltip, TreeMapHighlight, TreeMapSelection, TreeMapLegend);

/**
 * Default sample
 */
let data: object[] = [
    {Continent: "China_", Company: "Volkswagen", Sales: 3005994 },
    {Continent: "China_", Company: "General Motors", Sales: 1230044 },
    {Continent: "China_", Company: "Honda", Sales: 1197023 },
    {Continent: "United States_", Company: "General Motors", Sales:3042775  },
    {Continent: "United States_", Company: "Ford", Sales:2599193  },
    {Continent: "United States_", Company: "Toyota", Sales:2449587  }
]

let prevTime: Date; let curTime: Date;
let treemap: TreeMap = new TreeMap({
    titleSettings: {
        text: 'Car Sales by Country - 2017',
        textStyle: { size: '15px' }
    },
    dataSource: data,
    legendSettings: {
        visible: true,
        position: 'Top',
        shape: 'Rectangle',
    },
    palette: ['#C33764', '#AB3566', '#993367', '#853169', '#742F6A', '#632D6C', '#532C6D', '#412A6F', '#312870', '#1D2671'],
    tooltipSettings: {
        visible: true,
        format: '${Continent}'
    },
    weightValuePath: 'Sales',
    leafItemSettings: {
        labelPath: 'Company',
        border: { color: 'white', width: 0.5 }
    },
    levels: [
        {
            groupPath: 'Continent', border: { color: 'white', width: 0.5 },
        }
    ]
});
treemap.appendTo('#container');


