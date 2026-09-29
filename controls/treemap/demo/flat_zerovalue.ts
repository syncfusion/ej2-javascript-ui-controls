import { TreeMap } from '../src/treemap/treemap';
import { sales_zerodata } from '../demo/treemapData/flatCollection';
/**
 * Default sample
 */

let prevTime: Date; let curTime: Date;
let treemap: TreeMap = new TreeMap({  
    dataSource: sales_zerodata,
    weightValuePath: 'Sales',
    leafItemSettings: {
        labelPath: 'Name'
    },
});
treemap.appendTo('#container');


