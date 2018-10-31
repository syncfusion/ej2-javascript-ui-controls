import { TreeMap } from '../src/treemap/treemap';
import { hierarchicalDatas } from '../demo/Data/hierarchical';
/**
 * Default sample
 */

let prevTime: Date; let curTime: Date;
let treemap: TreeMap = new TreeMap({  
    dataSource: hierarchicalDatas,
    weightValuePath: 'value',
    levels:[
        {groupPath:'Country', headerFormat:'${CountryName}'},
    ],
    leafItemSettings:{
        labelPath:'Name'
    }
});
treemap.appendTo('#container');


