import { TreeMap } from '../src/treemap/treemap';
import { equal_color } from '../demo/treemapData/flatCollection';
/**
 * Default sample
 */

let prevTime: Date; let curTime: Date;
let treemap: TreeMap = new TreeMap({  
    dataSource: equal_color,
    weightValuePath: 'count',
    equalColorValuePath:'Brand',
    leafItemSettings: {
        labelPath: 'Car',
        colorMapping:[
            {
               value:'Ford',
               color:'green'
           },
           {
               value:'Audi',
               color:'red'
           },
           {
               value:'Maruti',
               color:'orange'
           }
        ]
     },
});
treemap.appendTo('#container');


