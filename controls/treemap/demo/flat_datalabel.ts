import { TreeMap } from '../src/treemap/treemap';
import { sales_data } from '../demo/treemapData/flatCollection';
import{ LabelAlignment }  from '../src/treemap/utils/enum';
/**
 * Default sample
 */

let prevTime: Date; let curTime: Date;
let treemap: TreeMap = new TreeMap({
    width: '300px',
    height:'200px',
    dataSource: sales_data,
    weightValuePath:'Sales',
    leafItemSettings: {
        showLabels: true,
        labelPath: 'Name'       
    },
});
treemap.appendTo('#container');
document.getElementById('labels').onchange = () => {
    var value = (<HTMLInputElement>document.getElementById('labels')).value;
    treemap.leafItemSettings.interSectAction = <LabelAlignment>value; 
    treemap.refresh();
}