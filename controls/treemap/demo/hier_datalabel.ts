import { TreeMap } from '../src/treemap/treemap';
import { hierarchicalData } from '../demo/Data/hierarchical';
import{ LabelAlignment }  from '../src/treemap/utils/enum';
/**
 * Default sample
 */

let prevTime: Date; let curTime: Date;
let treemap: TreeMap = new TreeMap({  
    width:'350px',
    dataSource: hierarchicalData,
    weightValuePath: 'value',
    levels:[
        {groupPath:'Country', headerFormat:'${CountryName}'},
    ],
    leafItemSettings:{
        labelPath:'Name'
    }
});
treemap.appendTo('#container');
document.getElementById('labels').onchange = () => {
    var value = (<HTMLInputElement>document.getElementById('labels')).value;
    treemap.leafItemSettings.interSectAction = <LabelAlignment>value; 
    treemap.refresh();
}