import { TreeMap } from '../../src/treemap/treemap';
import { TreeMapTooltip } from '../../src/treemap/user-interaction/tooltip';
import { TreeMapLegend } from '../../src/treemap/layout/legend';
import { electionData } from '../treemapData/Election_data';
import { LegendMode, LegendPosition } from '../../src/treemap/utils/enum';
TreeMap.Inject(TreeMapTooltip, TreeMapLegend);

let prevTime: Date; let curTime: Date;
let treemap: TreeMap = new TreeMap({
    titleSettings: {
        text: 'US Presidential election result - 2016',
        textStyle: { size: '15px' }
    },
    dataSource: electionData,
    weightValuePath: 'Population',
    tooltipSettings: {
        visible: true,
        format: ' <b>${Winner}<b><br>State : ${State}<br>Trump : ${Trump} %<br>Clinton : ${Clinton} %'
    },
    legendSettings: {
        visible: true,
        mode: 'Default',
        position: 'Top',
        shape: 'Rectangle'
    },
    format: 'n',
    useGroupingSeparator: true,
    rangeColorValuePath: 'WinPercentage',
    equalColorValuePath: 'Winner',
    leafItemSettings: {
        labelPath: 'State',
        fill: '#6699cc',
        border: { color: 'white', width: 0.5 },
        colorMapping: [
            {
                value: 'Trump', color: '#D84444'
            },
            {
                value: 'Clinton', color: '#316DB5'
            }
        ]
    },
});
treemap.appendTo('#container');

document.getElementById('layoutMode').onchange = () => {
    let positions = <HTMLSelectElement>document.getElementById('layoutMode');
    treemap.legendSettings.mode = <LegendMode>positions.value;
    treemap.refresh();
};
document.getElementById('legendPosition').onchange = () => {
    let positions = <HTMLSelectElement>document.getElementById('legendPosition');
    treemap.legendSettings.position = <LegendPosition>positions.value;
    treemap.refresh();
};