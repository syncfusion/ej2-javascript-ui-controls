import { TreeMap } from '../src/treemap/treemap';
import { desaturation_color } from '../demo/treemapData/flatCollection';
/**
 * Default sample
 */

let prevTime: Date; let curTime: Date;
let treemap: TreeMap = new TreeMap({  
    dataSource: desaturation_color,
    weightValuePath: 'count',
    rangeColorValuePath:'count',
    leafItemSettings: {
        labelPath: 'fruit',
        colorMapping:[
            {
               from:500,
               to:3000,
               minOpacity:0.2,
               maxOpacity:0.5,
               color:'orange'
           },
           {
               from:3000,
               to:5000,
               minOpacity:0.5,
               maxOpacity:0.8,
               color:'green'
           }
        ]
     }
});
treemap.appendTo('#container');


