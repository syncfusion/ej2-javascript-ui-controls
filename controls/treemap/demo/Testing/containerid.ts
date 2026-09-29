import { TreeMap } from '../../src/treemap/treemap';
import { TreeMapTooltip } from '../../src/treemap/user-interaction/tooltip';
import { TreeMapLegend } from '../../src/treemap/layout/legend';
import { CarSales } from '../treemapData/Car_Sale';
import { TreeMapHighlight, TreeMapSelection } from '../../src/treemap/user-interaction/highlight-selection';
TreeMap.Inject(TreeMapTooltip, TreeMapLegend,TreeMapHighlight,TreeMapSelection);
/**
 * Default sample
 */

let prevTime: Date; let curTime: Date;
let treemap: TreeMap = new TreeMap({
    titleSettings: {
        text: 'Car Sales by Country - 2017',
        textStyle: { size: '15px',fontFamily:'Segoe UI' }
    },
    rangeColorValuePath: 'Sales',
    format: 'n',
    useGroupingSeparator: true,
    dataSource: CarSales,
    legendSettings: {
        visible: true,
        position: 'Top',
        shape: 'Rectangle',
        border:{
         width:3 ,color:"blue"
        },
        textStyle:{
            fontFamily:'Segoe UI'
        }
    },
    palette: ['#C33764', '#AB3566', '#993367', '#853169', '#742F6A', '#632D6C', '#532C6D', '#412A6F', '#312870', '#1D2671'],
    tooltipSettings: {
        visible: true,
        textStyle:{
            fontFamily:'Segoe UI'
        }
    },
    selectionSettings: {
        enable: true,
        fill: '#58a0d3',
        border: { width: 0.3, color: 'black' },
        opacity: '1'
    },
    highlightSettings:{
      enable:true,
      fill:'green',
      border:{width:2 ,color:"white"},
      opacity: '1'
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
treemap.appendTo('#container_treemap');


