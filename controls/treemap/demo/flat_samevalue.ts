import { TreeMap } from '../src/treemap/treemap';
import { sales_samedata } from '../demo/treemapData/flatCollection';
/**
 * Default sample
 */

let prevTime: Date; let curTime: Date;
let treemap: TreeMap = new TreeMap({  
    dataSource: sales_samedata,
    weightValuePath: 'Sales',
    leafItemSettings: {
        labelPath: 'Name'
    },
});
treemap.appendTo('#container');


