import { TreeMap } from '../src/treemap/treemap';
import { sales_data } from '../demo/treemapData/flatCollection';
import{ LabelAlignment }  from '../src/treemap/utils/enum';
/**
 * Default sample
 */

let prevTime: Date; let curTime: Date;
let treemap: TreeMap = new TreeMap({
    palette: ['#9999ff', '#CCFF99', '#FFFF99', '#FF9999'],
    dataSource: sales_data,
    weightValuePath:'Sales',
    leafItemSettings: {
        showLabels: true,
        labelPath: 'Name'       
    },
});
treemap.appendTo('#container');
