import { TreeMap } from '../../src/treemap/treemap';
import { TreeMapTooltip } from '../../src/treemap/user-interaction/tooltip';
import { RTLData } from '../../demo/treemapData/rtl_data';
TreeMap.Inject(TreeMapTooltip);

let prevTime: Date; let curTime: Date;
let treemap: TreeMap = new TreeMap({
    palette: ['#5B244D', '#6F3953', ' #87525A', '#A26F63', '#BA896B', '#D5A574', '#F1C37D'],
    titleSettings: {
        text: 'List of Countries by Unemployment Rate',
        textStyle: { size: '15px' }
    },
    enableDrillDown: true,
    renderDirection: 'TopRightBottomLeft',
    enableRtl: true,
    format: 'n',
    useGroupingSeparator: true,
    dataSource: RTLData,
    weightValuePath: 'Size',
    tooltipSettings: {
        visible: true,
        format: '${Size} : ${Name}'
    },
    leafItemSettings: {
        labelPath: 'Name',
        showLabels: true
    },
    levels: [
        { groupPath: 'Continent', border: { color: 'black', width: 0.5 }, headerAlignment: 'Far' },
        { groupPath: 'Country', border: { color: 'black', width: 0.5 }, headerAlignment: 'Far' },
    ]
});
treemap.appendTo('#container');