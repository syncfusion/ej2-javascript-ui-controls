import { TreeMap } from '../src/treemap/treemap';
import { sales_data } from '../demo/treemapData/flatCollection';
import{ Alignment }  from '../src/treemap/utils/enum';
/**
 * Default sample
 */

let prevTime: Date; let curTime: Date;
let treemap: TreeMap = new TreeMap({
    palette: ['#9999ff', '#CCFF99', '#FFFF99', '#FF9999'],
    titleSettings:{
        text:'US country sales and expenses',
        textStyle:{size:'15px', color:'blue'}
    },
    border:{ width:4, color:'red'},
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
    treemap.titleSettings.alignment = <Alignment>value; 
    treemap.refresh();
}