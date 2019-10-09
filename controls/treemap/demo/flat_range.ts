import { TreeMap } from '../src/treemap/treemap';
import { range_color } from '../demo/treemapData/flatCollection';
/**
 * Default sample
 */

let prevTime: Date; let curTime: Date;
let treemap: TreeMap = new TreeMap({  
    dataSource: range_color,
    weightValuePath: 'count',
    rangeColorValuePath:'count',
    leafItemSettings: {
        labelPath: 'fruit',
        colorMapping:[
            {
               from:500,
               to:3000,
               color:'orange'
           },
           {
               from:3000,
               to:5000,
               color:'green'
           }
        ]
     },
});
treemap.appendTo('#container');


