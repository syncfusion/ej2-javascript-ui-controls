import { TreeMap } from '../src/treemap/treemap';
import { PdfExport } from '../src/index';
import { TreeMapTooltip } from '../src/treemap/user-interaction/tooltip';
import { TreeMapLegend } from '../src/treemap/layout/legend';
import { DrillDown } from './Data/Drilldown_Sample';
import { EmitType } from '@syncfusion/ej2-base';
import { ProductSale } from './treemapData/product';
TreeMap.Inject(TreeMapTooltip, TreeMapLegend, PdfExport);

let prevTime: Date; let curTime: Date;
let treemap: TreeMap = new TreeMap({
    theme: 'Bootstrap5',
    allowPdfExport: true,
    titleSettings: {
        text: 'Top 10 best selling smartphone brands - 2017',
        textStyle: { size: '15px' }
    },
    dataSource: ProductSale,
    layoutType: 'SliceAndDiceVertical',
    weightValuePath: 'Percentage',
    rangeColorValuePath: 'Percentage',
    tooltipSettings: {
        visible: true,
        format: '${Product} (+${Percentage}) %'
    },
    leafItemSettings: {
        labelPath: 'Product',
        fill: '#6699cc',
        border: { color: 'black', width: 0.5 },
        labelPosition: 'Center',
        interSectAction: 'Hide',
        labelFormat: '${Product} (+${Percentage}) %',
        colorMapping: [
            {
                from: 1.3,
                to: 22,
                color: '#FAB665',
                minOpacity: 0.5,
                maxOpacity: 1
            }
        ]
    },
});
treemap.appendTo('#container');

document.getElementById('togglebtn').onclick = () => {
    treemap.export('PDF', 'treemap');
};