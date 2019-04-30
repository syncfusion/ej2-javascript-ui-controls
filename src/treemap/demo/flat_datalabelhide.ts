import { TreeMap } from '../src/treemap/treemap';
import { equal_color } from '../demo/treemapData/flatCollection';
/**
 * Default sample
 */

let prevTime: Date; let curTime: Date;
let treemap: TreeMap = new TreeMap({  
    dataSource: equal_color,
    weightValuePath: 'count',
    leafItemSettings: {
        labelPath: 'Car',
        showLabels: false
     },
});
treemap.appendTo('#container');


