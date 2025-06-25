import { TreeMap } from '../../src/treemap/treemap';
import { TreeMapTooltip } from '../../src/treemap/user-interaction/tooltip';
import { Metals } from '../treemapData/metals';
import { Browser } from '@syncfusion/ej2-base';
TreeMap.Inject(TreeMapTooltip);

let prevTime: Date; let curTime: Date;
let treemap: TreeMap = new TreeMap({
    titleSettings: {
        text: 'US Gold medal categories in Summer Olympics - 2016',
        textStyle: { size: '15px' }
    },
    dataSource: Metals,
    weightValuePath: 'Gold',
    tooltipSettings: {
        visible: true,
        format: '${Sport} : ${Gold}'
    },
    leafItemSettings: {
        showLabels: !Browser.isDevice,
        labelPath: 'Sport',
        fill: '#993399',
        templatePosition: 'Center',
        border: { color: 'black', width: 0.5 },
        labelFormat: ' ${Sport} - ${Gold}',
        labelTemplate: '<div style="pointer-events: none;"><img src="../../Demo/images/{{:GameImage}}"' +
            ' style="height:{{:ItemHeight}};width:{{:ItemWidth}};"></img></div>'
    }
});
treemap.appendTo('#container');