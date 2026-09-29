import { TreeMap } from '../../src/treemap/treemap';
import { TreeMapTooltip } from '../../src/treemap/user-interaction/tooltip';
import { TreeMapLegend } from '../../src/treemap/layout/legend';
import { color } from '../../demo/treemapData/flatCollection';
TreeMap.Inject(TreeMapTooltip, TreeMapLegend);

let prevTime: Date; let curTime: Date;
let treemap: TreeMap = new TreeMap({
    titleSettings: {
        text: 'Top 10 largest islands in the World',
        textStyle: { size: '15px' }
    },
    format: 'n',
    useGroupingSeparator: true,
    rangeColorValuePath: 'Area',
    dataSource: color,
    legendSettings: {
        visible: true,
        position: 'Bottom',
        mode: 'Interactive',
        height: '10',
        title: {
            text: 'Area'
        },
    },
    tooltipSettings: {
        visible: true,
        format: 'Name: ${Name}<br>Area: ${Area} per square kms<br>Continent: ${Location}',
        opacity: 0.8
    },
    weightValuePath: 'Area',
    leafItemSettings: {
        labelPath: 'Name',
        border: { color: 'white', width: 0.5 },
        colorMapping: [
            { from: 100000, to: 250000, label: '0.1M - 0.25M', color: '#547C84' },
            { from: 250000, to: 550000, label: '0.25M - 0.55M', color: '#37AFAB' },
            { from: 550000, to: 750000, label: '0.55M - 0.75M', color: '#A4D6AD' },
            { from: 750000, to: 2250000, label: '0.75M - 2M', color: '#DEEBAE' },
            { to: null, from: null, color: 'null' },
            { to: null, from: null, color: 'null' },
        ]
    },
});
treemap.appendTo('#container');