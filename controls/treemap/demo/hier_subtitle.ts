import { TreeMap } from '../src/treemap/treemap';
import { hierarchicalData } from '../demo/Data/hierarchical';
import{ Alignment }  from '../src/treemap/utils/enum';
/**
 * Default sample
 */

let prevTime: Date; let curTime: Date;
let treemap: TreeMap = new TreeMap({  
    dataSource: hierarchicalData,
    titleSettings:{text:'Continent Sale value', subtitleSettings:{text:'-2016'}},
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
    treemap.titleSettings.subtitleSettings.alignment = <Alignment>value; 
    treemap.refresh();
}