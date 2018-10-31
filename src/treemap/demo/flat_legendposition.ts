import { TreeMap } from '../src/treemap/treemap';
import { sales_data } from '../demo/treemapData/flatCollection';
import{ LegendPosition }  from '../src/treemap/utils/enum';
import { TreeMapLegend } from '../src/treemap/layout/legend';
TreeMap.Inject( TreeMapLegend);
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
    legendSettings:{visible: true}
});
treemap.appendTo('#container');
document.getElementById('labels').onchange = () => {
        var value = (<HTMLInputElement>document.getElementById('labels')).value;
        treemap.legendSettings.position = <LegendPosition>value; 
        treemap.refresh();
    }
