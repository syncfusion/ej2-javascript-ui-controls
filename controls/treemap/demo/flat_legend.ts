import { TreeMap } from '../src/treemap/treemap';
import { range_color } from '../demo/treemapData/flatCollection';
import{ LegendMode }  from '../src/treemap/utils/enum';
import { TreeMapLegend } from '../src/treemap/layout/legend';
TreeMap.Inject( TreeMapLegend);
/**
 * Default sample
 */

let prevTime: Date; let curTime: Date;
let treemap: TreeMap = new TreeMap({
    dataSource: range_color,
    weightValuePath: 'count',
    rangeColorValuePath:'count',
    legendSettings: {
        visible: true,
        position: 'Top'
    },
    leafItemSettings: {
        labelPath: 'fruit',
        colorMapping:[
            {
               from:500,
               to:3000,
               color:'orange'
           },
           {
               from:3000,
               to:5000,
               color:'green'
           }
        ]
     }
});
treemap.appendTo('#container');
document.getElementById('labels').onchange = () => {
    var value = (<HTMLInputElement>document.getElementById('labels')).value;
    treemap.legendSettings.mode = <LegendMode>value; 
    treemap.refresh();
}