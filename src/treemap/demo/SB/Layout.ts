import { TreeMap } from '../../src/treemap/treemap';
import { LayoutMode, RenderingMode } from '../../src/treemap/utils/enum';
import { TreeMapTooltip } from '../../src/treemap/user-interaction/tooltip';
import { TreeMapLegend } from '../../src/treemap/layout/legend';
import { econmics } from '../treemapData/econmics';
TreeMap.Inject(TreeMapTooltip, TreeMapLegend);

let treemap: TreeMap = new TreeMap({
    titleSettings: {
        text: 'Top 10 countries by GDP Nominal - 2015',
        textStyle: { size: '15px' }
    },
    dataSource: econmics,
    weightValuePath: 'GDP',
    tooltipSettings: {
        visible: true,
        format: '${State}<br>Rank : ${Rank}'
    },
    rangeColorValuePath: 'GDP',
    leafItemSettings: {
        labelPath: 'State',
        labelFormat: '${State}<br>$${GDP} Trillion<br>(${percentage} %)',
        labelStyle: {
            color: '#000000'
        },
        border: {
            color: '#000000',
            width: 0.5
        },
        colorMapping: [
            {
                from: 1550,
                to: 17946,
                color: '#9cbb59',
                minOpacity: 0.7,
                maxOpacity: 1,
            }
        ]
    },
});
treemap.appendTo('#container');

document.getElementById('layoutMode').onchange = () => {
    let mode = <HTMLSelectElement>document.getElementById('layoutMode');
    treemap.layoutType = <LayoutMode>mode.value;
    treemap.refresh();
};
document.getElementById('renderDirection').onchange = () => {
    let render = <HTMLSelectElement>document.getElementById('renderDirection');
    treemap.renderDirection = <RenderingMode>render.value;
    treemap.refresh();
};