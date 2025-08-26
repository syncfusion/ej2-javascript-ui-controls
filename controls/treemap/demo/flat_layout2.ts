import { TreeMap } from '../src/treemap/treemap';
import { sales_data } from '../demo/treemapData/flatCollection';
/**
 * Default sample
 */

let prevTime: Date; let curTime: Date;
let treemap: TreeMap = new TreeMap({  
    dataSource: sales_data,
    weightValuePath: 'Sales',
    layoutType:'SliceAndDiceHorizontal',
    leafItemSettings: {
        labelPath: 'Name'
    },
});
treemap.appendTo('#container');


