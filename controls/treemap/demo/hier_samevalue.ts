import { TreeMap } from '../src/treemap/treemap';
import { hier_samedata } from '../demo/Data/hierarchical';
/**
 * Default sample
 */

let prevTime: Date; let curTime: Date;
let treemap: TreeMap = new TreeMap({  
    dataSource: hier_samedata,
    weightValuePath: 'value',
    levels:[
        {groupPath:'Country', headerFormat:'${CountryName}'},
    ],
    leafItemSettings:{
        labelPath:'Name'
    }
});
treemap.appendTo('#container');


