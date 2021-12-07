import { TreeMap } from '../src/treemap/treemap';
import { hierarchicalData } from '../demo/Data/hierarchical';
/**
 * Default sample
 */

let prevTime: Date; let curTime: Date;
let treemap: TreeMap = new TreeMap({  
    dataSource: hierarchicalData,
    palette: ['#9999ff', '#CCFF99', '#FFFF99', '#FF9999'],
    titleSettings:{text:'Continent Sale value'},
    weightValuePath: 'value',
    levels:[
        {groupPath:'Country', headerFormat:'${CountryName}',opacity:0.1},
    ],
    leafItemSettings:{
        labelPath:'Name',
        opacity:0.5
    }
});
treemap.appendTo('#container');