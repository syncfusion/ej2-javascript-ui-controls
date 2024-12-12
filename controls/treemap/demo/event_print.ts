import { TreeMap,  } from '../src/treemap/treemap';
import { TreeMapTooltip } from '../src/treemap/user-interaction/tooltip';
import { TreeMapLegend,  } from '../src/treemap/layout/legend';
import { DrillDown,  } from '../demo/Data/Drilldown_Sample';
import { EmitType } from '@syncfusion/ej2-base';
import { CarSales } from './treemapData/Car_Sale';
import{ IPrintEventArgs, ILoadedEventArgs } from '../src/treemap/model/interface';
TreeMap.Inject(TreeMapTooltip, TreeMapLegend);
/**
 * Default sample
 */

let prevTime: Date; let curTime: Date;

let printRendering: EmitType<ILoadedEventArgs> = (args: ILoadedEventArgs) => {
    args.treemap.print();
}; 
let treemap: TreeMap = new TreeMap({
    titleSettings: {
        text: 'Car Sales by Country - 2017',
        textStyle: { size: '15px' }
    },
    
    rangeColorValuePath: 'Sales',
    format: 'n',
    useGroupingSeparator: true,
    dataSource: CarSales,
    legendSettings: {
        visible: true,
        position: 'Top',
        shape: 'Rectangle',
    },
    palette: ['#C33764', '#AB3566', '#993367', '#853169', '#742F6A', '#632D6C', '#532C6D', '#412A6F', '#312870', '#1D2671'],
    tooltipSettings: {
        visible: true
    },
    weightValuePath: 'Sales',
    leafItemSettings: {
        labelPath: 'Company',
        border: { color: 'white', width: 0.5 }
    },
    loaded:printRendering
});
treemap.appendTo('#container');




