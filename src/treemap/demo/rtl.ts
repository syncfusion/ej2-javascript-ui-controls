import { TreeMap } from '../src/treemap/treemap';
import { TreeMapTooltip } from '../src/treemap/user-interaction/tooltip';
import { RTLData } from '../demo/treemapData/rtl_data';
TreeMap.Inject(TreeMapTooltip);

/**
 * Default sample
 */

let prevTime: Date; let curTime: Date;
let treemap: TreeMap = new TreeMap({   
    //load: treemapload,
    palette: ['#3f734c', '#519462', ' #6bae7c', '#7bb78a', '#9cc9a7', '#bddbc5', '#deede2'],
    titleSettings: {
        text: 'List of Countries by Unemployment Rate',
        textStyle: { size: '15px' }
    },
    enableDrillDown: true,
    format: 'n',
    useGroupingSeparator: true,
    dataSource: RTLData,
    enableRtl:true,
    renderDirection:'TopRightBottomLeft',
    weightValuePath: 'Size',
    tooltipSettings: {
        visible: true,
        format: '${Size} : ${Name}'
    },
    leafItemSettings: {
        labelPath: 'Name',
        showLabels: true, 
        //labelIntersectAction:''      
    },
    levels: [
        { groupPath: 'Continent', fill: '#336699', border: { color: 'black', width: 0.5 } },
        { groupPath: 'Country', fill: '#336699', border: { color: 'black', width: 0.5 } }      
    ]
});
treemap.appendTo('#container');


