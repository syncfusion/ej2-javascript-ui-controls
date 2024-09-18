import { TreeMap } from '../src/treemap/treemap';
import { hier_samedata } from '../demo/Data/hierarchical';
/**
 * Default sample
 */

let prevTime: Date; let curTime: Date;
let treemap: TreeMap = new TreeMap({  
    dataSource: hier_samedata,
    weightValuePath: 'value',
    rangeColorValuePath:'value',
    levels:[
        {groupPath:'Country', headerFormat:'${CountryName}',colorMapping:[
            {
               from:0,
               to:50,
               minOpacity:0.2,
               maxOpacity:0.5,
               color:'orange'
           },
           {
               from:50,
               to:120,
               minOpacity:0.5,
               maxOpacity:0.8,
               color:'green'
           }
        ]
    },
    ],
    leafItemSettings:{
        labelPath:'Name',
        colorMapping:[
            {
               from:0,
               to:50,
               minOpacity:0.2,
               maxOpacity:0.5,
               color:'orange'
           },
           {
               from:50,
               to:120,
               minOpacity:0.5,
               maxOpacity:0.8,
               color:'green'
           }
        ]
    }
});
treemap.appendTo('#container');


